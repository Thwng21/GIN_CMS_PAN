import { Search } from 'lucide-react'

const columns = [
  ['SHD', 'SHD'],
  ['TÊN KH', 'TÊN KH'],
  ['DOB', 'DOB'],
  ['CMND/CCCD', 'CMND/CCCD'],
  ['SDT', 'SDT'],
  ['GIN', 'GIN'],
  ['Chức Danh', 'Chức Danh'],
  ['TÊN CTY', 'TÊN CTY'],
  ['PB', 'PB'],
]

export default function SHDTable({ rows, search, setSearch }) {
  const filtered = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value ?? '').toLowerCase().includes(search.toLowerCase())
    )
  )

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#10131a]">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Dữ liệu đầu vào</h2>
          <p className="mt-1 text-xs text-gray-500">
            {filtered.length} / {rows.length} bản ghi
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b0d12] px-3 py-2">
          <Search size={15} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm bản ghi..."
            className="w-full bg-transparent text-sm outline-none sm:w-48"
          />
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="sticky top-0 bg-[#171a23] text-xs text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              {columns.map(([label]) => (
                <th key={label} className="px-4 py-3 font-medium">{label}</th>
              ))}
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((row, index) => (
              <tr key={row.__rowId ?? index} className="hover:bg-white/[0.025]">
                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                {columns.map(([label, key]) => (
                  <td key={key} className="max-w-48 truncate px-4 py-3">
                    {String(row[key] ?? '') || <span className="text-gray-600">—</span>}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-500/10 px-2 py-1 text-xs text-gray-400">
                    Chưa xử lý
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-gray-500">
                  {rows.length ? 'Không tìm thấy bản ghi phù hợp.' : 'Chưa có dữ liệu. Hãy chọn file Excel phía trên.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
