import { UserRound } from 'lucide-react'

export default function PANPage() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/15 p-3 text-violet-400">
          <UserRound size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">PAN Tool</h1>
          <p className="text-sm text-gray-400">Không gian làm việc PAN.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-white/15 bg-[#10131a] p-8">
        <h2 className="font-semibold">Khu vực phát triển PAN</h2>
        <p className="mt-2 text-sm leading-6 text-gray-400">
          Trang này hiện là giao diện mẫu, sẵn sàng để bổ sung chức năng sau.
        </p>
      </div>
    </section>
  )
}
