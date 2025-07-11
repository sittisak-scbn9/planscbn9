import { Plus, Edit, Trash2, Wrench } from 'lucide-react'
import { DataTable } from '../components/ui/DataTable'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useSupabaseQuery } from '../hooks/useSupabaseQuery'

export function VehiclesPage() {
  const { data: vehicles, isLoading } = useSupabaseQuery<any>(
    ['vehicles'],
    'vehicles',
    '*, vehicle_type:vehicle_types(name)'
  )

  const columns = [
    {
      key: 'vehicle_code' as keyof any,
      header: 'Vehicle Code',
      render: (value: any) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
      sortable: true,
    },
    {
      key: 'plate_number' as keyof any,
      header: 'Plate Number',
      render: (value: any) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
      sortable: true,
    },
    {
      key: 'vehicle_type' as keyof any,
      header: 'Type',
      render: (value: any, row: any) => (
        <div className="text-sm text-gray-900">
          {row.vehicle_type?.name || 'Unknown'}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'brand' as keyof any,
      header: 'Brand & Model',
      render: (value: any, row: any) => (
        <div>
          <div className="font-medium text-gray-900">{value || 'Unknown'}</div>
          <div className="text-sm text-gray-500">{row.model || 'Unknown'}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'year' as keyof any,
      header: 'Year',
      render: (value: any) => (
        <div className="text-sm text-gray-900">{value || 'Unknown'}</div>
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
          <button className="p-1 text-orange-600 hover:text-orange-800">
            <Wrench className="h-4 w-4" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage your vehicle fleet</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Vehicle
        </button>
      </div>

      <DataTable
        data={vehicles || []}
        columns={columns}
        loading={isLoading}
        onRowClick={(vehicle) => {
          console.log('Vehicle clicked:', vehicle)
        }}
      />
    </div>
  )
}