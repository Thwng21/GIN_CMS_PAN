import { useLocation } from 'react-router-dom'
import { Bell, Search, Command } from 'lucide-react'

const pageTitles = {
  '/overview': 'Dashboard',
  '/tools': 'Tất cả công cụ',
  '/tools/shd': 'SHD Tool',
  '/tools/gin': 'GIN Tool',
  '/tools/pan': 'PAN Tool',
  '/settings': 'Cài đặt',
}

export default function Header() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'SHD Tools'

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#10131a] px-6">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          SHD Tools / {title}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 md:flex">
          <Search size={15} className="text-gray-500" />
          <span className="text-xs text-gray-500">Tìm kiếm...</span>
          <Command size={13} className="ml-4 text-gray-600" />
          <span className="text-xs text-gray-600">K</span>
        </div>

        <button
          type="button"
          aria-label="Thông báo"
          className="relative rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold">
          AT
        </div>
      </div>
    </header>
  )
}
