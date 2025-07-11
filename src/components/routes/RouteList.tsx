import { useState } from 'react'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { DataTable } from '../ui/DataTable'
import { StatusBadge } from '../ui/StatusBadge'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { formatDate } from '../../lib/utils'

export function RouteList() {
  const { data: routes, isLoading } = useSupabaseQuery<any>(
    ['routes'],
    'routes',
    '*, customer:customers(name)'
  )

  const columns = [
    {
      key: 'route_code' as keyof any,
      header: 'Route Code',
      render: (value: any) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
      sortable: true,
    },
    {
      key: 'name' as keyof any,
      header: 'Route Name',
      render: (value: any, row: any) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.customer?.name}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'origin_name' as keyof any,
      header: 'Origin',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value || 'Not set'}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'destination_name' as keyof any,
      header: 'Destination',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value || 'Not set'}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'region' as keyof any,
      header: 'Region',
      render: (value: any) => (
        <div className="text-sm text-gray-900">{value || 'Unknown'}</div>
      ),
      sortable: true,
    },
    {
      key: 'estimated_distance_km' as keyof any,
      header: 'Distance (km)',
      render: (value: any) => (
        <div className="text-sm text-gray-900">
          {value ? `${value} km` : 'Not calculated'}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'estimated_duration_minutes' as keyof any,
      header: 'Duration (mins)',
      render: (value: any) => (
        <div className="text-sm text-gray-900">
          {value ? `${value} mins` : 'Not calculated'}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status' as keyof any,
      header: 'Status',
      render: (value: any) => <StatusBadge status={value} />,
      sortable: true,
    },
    {
      key: 'actions' as keyof any,
      header: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Routes</h2>
          <p className="text-gray-600">Manage transport routes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Route
        </button>
      </div>

      {/* Routes Table */}
      <DataTable
        data={routes || []}
        columns={columns}
        loading={isLoading}
        onRowClick={(route) => {
          console.log('Route clicked:', route)
        }}
      />
    </div>
  )
}