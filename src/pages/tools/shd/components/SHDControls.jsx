import { Play, Settings2 } from 'lucide-react'

export default function SHDControls({
  concurrency,
  setConcurrency,
  timeout,
  setTimeoutValue,
  onPrepare,
  disabled,
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#10131a] p-5">
      <div className="mb-5 flex items-center gap-2">
        <Settings2 size={18} className="text-violet-400" />
        <h2 className="font-semibold">Cấu hình tác vụ</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-sm text-gray-400">Số tác vụ đồng thời</span>
          <select
            value={concurrency}
            onChange={(e) => setConcurrency(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3 py-2.5 text-sm outline-none focus:border-violet-500"
          >
            {[1, 2, 3, 5, 10].map((n) => (
              <option key={n} value={n}>{n} tác vụ</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="block text-sm text-gray-400">Thời gian chờ (giây)</span>
          <select
            value={timeout}
            onChange={(e) => setTimeoutValue(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-[#0b0d12] px-3 py-2.5 text-sm outline-none focus:border-violet-500"
          >
            {[15, 30, 60, 120].map((n) => (
              <option key={n} value={n}>{n} giây</option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onPrepare}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Play size={16} />
        Chuẩn bị tác vụ
      </button>

      <p className="mt-3 text-xs leading-5 text-gray-500">
        Nút này kiểm tra dữ liệu và cấu hình. Tự động thao tác website sẽ được tích hợp ở bước sau.
      </p>
    </section>
  )
}
