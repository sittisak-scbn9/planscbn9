import { useState, useEffect } from 'react'
import { supabase, type User } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - proceeding without authentication')
        setLoading(false)
        setError('Authentication timeout - please refresh the page')
      }
    }, 10000) // 10 second timeout
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return
      
      if (error) {
        console.error('Error getting session:', error)
        setError(error.message)
        setLoading(false)
        return
      }
      
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        // No session - proceed to login form
        setLoading(false)
      }
    }).catch((error) => {
      if (!mounted) return
      console.error('Error in getSession:', error)
      setError('Failed to initialize authentication')
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      console.log('Auth state changed:', event, session?.user?.email)
      
      setSession(session)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    if (!userId) {
      setLoading(false)
      return
    }
    
    try {
      console.log('Fetching user profile for:', userId)
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        
        // If user doesn't exist in users table, try to create a basic profile
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, creating new profile...')
          const { data: authUser } = await supabase.auth.getUser()
          if (authUser.user) {
            const newUser = {
              id: authUser.user.id,
              email: authUser.user.email || '',
              name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'User',
              role: 'Viewer',
              status: 'Active',
            }
            
            const { data: createdUser, error: createError } = await supabase
              .from('users')
              .insert([newUser])
              .select()
              .single()
            
            if (!createError && createdUser) {
              console.log('Created new user profile:', createdUser)
              setUser(createdUser)
            } else {
              console.error('Error creating user profile:', createError)
              // Proceed without user profile for now
              setUser({
                id: authUser.user.id,
                user_code: 'TEMP',
                email: authUser.user.email || '',
                name: authUser.user.user_metadata?.name || 'User',
                role: 'Viewer',
                status: 'Active',
                preferences: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } as User)
            }
          }
        } else {
          // Other database errors
          console.error('Database error:', error)
          setError('Failed to load user profile')
        }
      } else {
        console.log('User profile loaded:', data)
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signUp = async (email: string, password: string, name: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name,
            role: 'Viewer',
            status: 'Active',
          },
        ])

      if (profileError) throw profileError
    }

    return data
  }

  const signOut = async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    setUser(data)
    return data
  }

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}