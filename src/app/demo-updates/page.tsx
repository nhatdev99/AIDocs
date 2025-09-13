import { UpdateLogTable } from '@/components/updates/update-log-table'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo Update Log - AIDocs',
  description: 'Demo trang Update Log với khả năng hiển thị hình ảnh',
}

export default function DemoUpdatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Demo Update Log</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trang demo cho bảng log cập nhật với khả năng hiển thị hình ảnh chi tiết
          </p>
        </div>

        <UpdateLogTable />
      </div>
    </div>
  )
}
