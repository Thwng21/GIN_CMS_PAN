import { FileSpreadsheet, Upload } from 'lucide-react'

export default function ExcelUploader({ onFile, fileName, rowCount }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center transition hover:border-violet-500/60 hover:bg-violet-500/5">
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
      <div className="mb-3 rounded-xl bg-violet-500/15 p-3 text-violet-400">
        {fileName ? <FileSpreadsheet size={25} /> : <Upload size={25} />}
      </div>
      <p className="font-medium">{fileName || 'Chọn file Excel để bắt đầu'}</p>
      <p className="mt-1 text-xs text-gray-500">
        Hỗ trợ XLSX, XLS và CSV
      </p>
      {rowCount > 0 && (
        <span className="mt-3 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
          Đã đọc {rowCount} bản ghi
        </span>
      )}
    </label>
  )
}
