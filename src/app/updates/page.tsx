import { UpdateLogTable } from '@/components/updates/update-log-table'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Update Log - AIDocs',
  description: 'Lịch sử cập nhật và cải thiện của hệ thống AIDocs',
}

export default function UpdatesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <UpdateLogTable />
    </div>
  )
}
