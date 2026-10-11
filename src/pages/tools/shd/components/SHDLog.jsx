import { Terminal } from 'lucide-react'

export default function SHDLog({ logs }) {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#10131a]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <Terminal size={17} className="text-violet-400" />
        <h2 className="text-sm font-semibold">Nhật ký hoạt động</h2>
      </div>

      <div className="max-h-48 space-y-2 overflow-y-auto p-4 font-mono text-xs">
        {logs.map((log, index) => (
          <p key={`${log.time}-${index}`} className="break-words leading-5">
            <span className="text-gray-600">[{log.time}] </span>
            <span className={log.type === 'error' ? 'text-red-400' : 'text-gray-300'}>
              {log.message}
            </span>
          </p>
        ))}
      </div>
    </section>
  )
}
