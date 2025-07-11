import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { LoginForm } from './components/auth/LoginForm'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { DashboardPage } from './pages/DashboardPage'
import { SchedulesPage } from './pages/SchedulesPage'
import { RoutesPage } from './pages/RoutesPage'
import { DriversPage } from './pages/DriversPage'
import { VehiclesPage } from './pages/VehiclesPage'
import { VehicleTypesPage } from './pages/VehicleTypesPage'
import { ConflictsPage } from './pages/ConflictsPage'
import { AlertsPage } from './pages/AlertsPage'
import { SuggestionsPage } from './pages/SuggestionsPage'
import { ExportsPage } from './pages/ExportsPage'
import { AuditPage } from './pages/AuditPage'
import { SettingsPage } from './pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function AppContent() {
  const { user, loading, error } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading application...</p>
          <p className="mt-2 text-sm text-gray-500">
            If this takes too long, please refresh the page
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Connection Error
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicle-types" element={<VehicleTypesPage />} />
            <Route path="/conflicts" element={<ConflictsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/suggestions" element={<SuggestionsPage />} />
            <Route path="/exports" element={<ExportsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
        <Toaster position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} />
      </Router>
    </QueryClientProvider>
  )
}

export default App