import { Activity, CheckCircle2, Clock, Wrench } from 'lucide-react'

const stats = [
  { label: 'Tổng công cụ', value: '06', icon: Wrench },
  { label: 'Đang hoạt động', value: '04', icon: Activity },
  { label: 'Tác vụ hoàn thành', value: '128', icon: CheckCircle2 },
  { label: 'Thời gian tiết kiệm', value: '12h', icon: Clock },
]

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-violet-400">WORKSPACE OVERVIEW</p>
        <h1 className="mt-2 text-3xl font-bold">Chào mừng đến SHD Tools</h1>
        <p className="mt-2 text-sm text-gray-400">
          Quản lý và sử dụng các công cụ của bạn tại một nơi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-[#10131a] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{label}</span>
              <Icon size={19} className="text-violet-400" />
            </div>
            <p className="mt-4 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#10131a] p-6">
        <h2 className="text-lg font-semibold">Bắt đầu nhanh</h2>
        <p className="mt-2 text-sm leading-6 text-gray-400">
          Chọn mục Tất cả công cụ ở thanh bên trái để xem danh sách công cụ.
          Các số liệu trên hiện là dữ liệu mẫu, chưa kết nối dữ liệu thực tế.
        </p>
      </section>
    </div>
  )
}
