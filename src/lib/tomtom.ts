const TOMTOM_API_KEY = '1r6aBtuWPGVZ9esC0LGDMno5NsZu6DRP'

export interface RouteCalculation {
  distance: number
  duration: number
  traffic_factor: number
}

export async function calculateRoute(
  origin: [number, number],
  destination: [number, number]
): Promise<RouteCalculation> {
  try {
    const response = await fetch(
      `https://api.tomtom.com/routing/1/calculateRoute/${origin[0]},${origin[1]}:${destination[0]},${destination[1]}/json?key=${TOMTOM_API_KEY}&traffic=true&travelMode=car`
    )
    
    if (!response.ok) {
      throw new Error('Failed to calculate route')
    }
    
    const data = await response.json()
    const route = data.routes[0]
    
    return {
      distance: route.summary.lengthInMeters / 1000, // Convert to km
      duration: route.summary.travelTimeInSeconds / 60, // Convert to minutes
      traffic_factor: route.summary.trafficDelayInSeconds > 0 ? 1.2 : 1.0
    }
  } catch (error) {
    console.error('Error calculating route:', error)
    throw error
  }
}

export async function batchCalculateRoutes(
  routes: Array<{
    origin: [number, number]
    destination: [number, number]
  }>
): Promise<RouteCalculation[]> {
  const calculations = await Promise.all(
    routes.map(route => calculateRoute(route.origin, route.destination))
  )
  
  return calculations
}