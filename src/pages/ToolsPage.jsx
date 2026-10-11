import { Link } from 'react-router-dom'
import { ArrowUpRight, CreditCard, FileText, UserRound } from 'lucide-react'

const tools = [
  { name: 'SHD Tool', description: 'Khu vực dành cho các tác vụ SHD.', path: '/tools/shd', icon: FileText },
  { name: 'GIN Tool', description: 'Khu vực dành cho các tác vụ GIN.', path: '/tools/gin', icon: CreditCard },
  { name: 'PAN Tool', description: 'Khu vực dành cho các tác vụ PAN.', path: '/tools/pan', icon: UserRound },
]

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tất cả công cụ</h1>
        <p className="mt-2 text-sm text-gray-400">Chọn công cụ để mở trang làm việc riêng.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ name, description, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="group rounded-2xl border border-white/10 bg-[#10131a] p-5 transition hover:border-violet-500/50 hover:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-violet-500/15 p-3 text-violet-400">
                <Icon size={23} />
              </div>
              <ArrowUpRight size={18} className="text-gray-500 transition group-hover:text-violet-400" />
            </div>
            <h2 className="mt-5 font-semibold">{name}</h2>
            <p className="mt-2 text-sm text-gray-400">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
