import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react'
import { DataTable } from '../components/ui/DataTable'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useSupabaseQuery } from '../hooks/useSupabaseQuery'

export function DriversPage() {
  const { data: drivers, isLoading } = useSupabaseQuery<any>(['drivers'], 'drivers')

  const columns = [
    {
      key: 'driver_code' as keyof any,
      header: 'Driver Code',
      render: (value: any) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
      sortable: true,
    },
    {
      key: 'name' as keyof any,
      header: 'Name',
      render: (value: any) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
      sortable: true,
    },
    {
      key: 'phone' as keyof any,
      header: 'Phone',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value || 'Not provided'}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'email' as keyof any,
      header: 'Email',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value || 'Not provided'}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'license_number' as keyof any,
      header: 'License Number',
      render: (value: any) => (
        <div className="text-sm text-gray-900">{value || 'Not provided'}</div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Drivers</h1>
          <p className="text-gray-600">Manage your driver fleet</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Driver
        </button>
      </div>

      <DataTable
        data={drivers || []}
        columns={columns}
        loading={isLoading}
        onRowClick={(driver) => {
          console.log('Driver clicked:', driver)
        }}
      />
    </div>
  )
}