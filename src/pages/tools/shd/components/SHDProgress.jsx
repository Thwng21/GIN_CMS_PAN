import { Activity } from 'lucide-react'

export default function SHDProgress({ total }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#10131a] p-5">
      <div className="flex items-center gap-2">
        <Activity size={18} className="text-violet-400" />
        <h2 className="font-semibold">Tiến trình xử lý</h2>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-gray-400">Tiến độ</span>
        <span>0 / {total}</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-0 rounded-full bg-violet-500" />
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-500">
        Chưa có tác vụ nào được chạy. Tiến trình sẽ được kết nối khi tích hợp bộ xử lý.
      </p>
    </section>
  )
}
