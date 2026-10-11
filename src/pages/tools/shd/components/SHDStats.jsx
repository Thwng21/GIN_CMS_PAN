import { CheckCircle2, CircleAlert, Clock3, Database } from 'lucide-react'

const items = [
  { key: 'total', label: 'Tổng bản ghi', icon: Database },
  { key: 'success', label: 'Thành công', icon: CheckCircle2 },
  { key: 'pending', label: 'Đang chờ', icon: Clock3 },
  { key: 'errors', label: 'Lỗi', icon: CircleAlert },
]

export default function SHDStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map(({ key, label, icon: Icon }) => (
        <div key={key} className="rounded-xl border border-white/10 bg-[#10131a] p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400">{label}</span>
            <Icon size={17} className="text-violet-400" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{stats[key]}</p>
        </div>
      ))}
    </div>
  )
}
