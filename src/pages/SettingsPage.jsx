import { Settings, ShieldCheck } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="mt-2 text-sm text-gray-400">Thông tin cấu hình ứng dụng.</p>
      </div>

      <section className="max-w-2xl rounded-2xl border border-white/10 bg-[#10131a] p-6">
        <div className="flex items-center gap-3">
          <Settings className="text-violet-400" size={22} />
          <h2 className="font-semibold">Thông tin ứng dụng</h2>
        </div>
        <div className="mt-5 space-y-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Tên ứng dụng</span>
            <span>SHD Tools V2</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Phiên bản</span>
            <span>2.0.0</span>
          </div>
          <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-gray-400">
            <ShieldCheck size={17} className="text-green-400" />
            <span>Trạng thái: giao diện đang phát triển</span>
          </div>
        </div>
      </section>
    </div>
  )
}
