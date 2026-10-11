import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wrench,
  Settings,
  Zap,
  FileText,
  CreditCard,
  UserRound,
  ChevronRight,
} from 'lucide-react'

const menuGroups = [
  {
    title: 'TỔNG QUAN',
    items: [
      { label: 'Dashboard', path: '/overview', icon: LayoutDashboard },
    ],
  },
  {
    title: 'CÔNG CỤ',
    items: [
      { label: 'Tất cả công cụ', path: '/tools', icon: Wrench },
      { label: 'SHD Tool', path: '/tools/shd', icon: FileText },
      { label: 'GIN Tool', path: '/tools/gin', icon: CreditCard },
      { label: 'PAN Tool', path: '/tools/pan', icon: UserRound },
    ],
  },
  {
    title: 'HỆ THỐNG',
    items: [
      { label: 'Cài đặt', path: '/settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#10131a]">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
          <Zap size={20} />
        </div>

        <div>
          <h1 className="text-base font-bold tracking-wide">SHD TOOLS</h1>
          <p className="text-xs text-gray-500">Desktop Workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-gray-500">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-violet-600/15 font-medium text-violet-400'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon size={17} />
                  <span className="flex-1">{label}</span>
                  <ChevronRight
                    size={14}
                    className="opacity-0 transition group-hover:opacity-60"
                  />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600/20 text-sm font-bold text-violet-300">
            AT
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">SHD Workspace</p>
            <p className="text-xs text-gray-500">Desktop App</p>
          </div>

          <span className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      </div>
    </aside>
  )
}
