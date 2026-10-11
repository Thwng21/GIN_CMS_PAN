import { useState } from 'react'
import * as XLSX from 'xlsx'
import { Download, FileSpreadsheet, RotateCcw } from 'lucide-react'

import ExcelUploader from './shd/components/ExcelUploader'
import SHDStats from './shd/components/SHDStats'
import SHDControls from './shd/components/SHDControls'
import SHDTable from './shd/components/SHDTable'
import SHDProgress from './shd/components/SHDProgress'
import SHDLog from './shd/components/SHDLog'
import EmbeddedBrowser from './shd/components/EmbeddedBrowser'

const fields = [
  'SHD', 'TÊN KH', 'DOB', 'CMND/CCCD', 'SDT',
  'GIN', 'Chức Danh', 'TÊN CTY', 'PB',
]

function normalizeHeader(value) {
  return String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
}

const aliases = {
  SHD: ['shd'],
  'TÊN KH': ['tenkh', 'hotenkh', 'khachhang', 'customername'],
  DOB: ['dob', 'ngaysinh', 'birthday'],
  'CMND/CCCD': ['cmndcccd', 'cmnd', 'cccd', 'socccd', 'identitynumber'],
  SDT: ['sdt', 'sodienthoai', 'phone', 'phonenumber'],
  GIN: ['gin'],
  'Chức Danh': ['chucdanh', 'position', 'title'],
  'TÊN CTY': ['tencty', 'tencongty', 'company', 'companyname'],
  PB: ['pb', 'phongban', 'department'],
}

function normalizeRow(source) {
  const result = {}
  const sourceEntries = Object.entries(source)

  for (const field of fields) {
    const candidates = aliases[field]
    const match = sourceEntries.find(([key]) =>
      candidates.includes(normalizeHeader(key))
    )
    result[field] = match ? String(match[1] ?? '').trim() : ''
  }

  return result
}

function getTime() {
  return new Date().toLocaleTimeString('vi-VN', { hour12: false })
}

export default function SHDPage() {
  const [rows, setRows] = useState([])
  const [fileName, setFileName] = useState('')
  const [search, setSearch] = useState('')
  const [concurrency, setConcurrency] = useState(3)
  const [timeout, setTimeoutValue] = useState(30)
  const [logs, setLogs] = useState([
    { time: getTime(), type: 'info', message: 'SHD Tool đã sẵn sàng.' },
  ])
  const [busy, setBusy] = useState(false)
  const [browserOpen, setBrowserOpen] = useState(false)

  const addLog = (message, type = 'info') => {
    setLogs((current) => [
      ...current,
      { time: getTime(), type, message },
    ])
  }

  async function handleFile(file) {
    try {
      setBusy(true)

      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      if (!sheet) throw new Error('File không có sheet dữ liệu.')

      const sourceRows = XLSX.utils.sheet_to_json(sheet, {
        defval: '',
        raw: false,
      })

      if (sourceRows.length === 0) {
        throw new Error('Sheet đầu tiên không có bản ghi.')
      }

      const parsedRows = sourceRows.map((source, index) => ({
        ...normalizeRow(source),
        __rowId: index + 1,
        __status: 'Chưa xử lý',
      }))

      setRows(parsedRows)
      setFileName(file.name)
      setSearch('')
      addLog(`Đã đọc ${parsedRows.length} bản ghi từ ${file.name}.`)
      addLog('Hãy kiểm tra tên cột và dữ liệu trước khi tiếp tục.')
    } catch (error) {
      addLog(error.message || 'Không thể đọc file.', 'error')
    } finally {
      setBusy(false)
    }
  }

  function prepareTasks() {
    if (!rows.length) {
      addLog('Vui lòng nhập file Excel trước.', 'error')
      return
    }

    const missingSHD = rows.filter((row) => !row.SHD).length

    addLog(`Đã kiểm tra ${rows.length} bản ghi.`)
    addLog(`Cấu hình: ${concurrency} tác vụ đồng thời, timeout ${timeout} giây.`)

    if (missingSHD > 0) {
      addLog(`Có ${missingSHD} bản ghi thiếu SHD. Cần kiểm tra lại.`, 'error')
    } else {
      addLog('Các bản ghi đều có SHD. Dữ liệu đã sẵn sàng để tích hợp bộ xử lý.')
    }

    addLog('Chưa gửi dữ liệu đến website: bộ tự động hóa chưa được tích hợp.')
  }

  function exportExcel() {
    if (!rows.length) {
      addLog('Chưa có dữ liệu để xuất.', 'error')
      return
    }

    const exportRows = rows.map((row) =>
      Object.fromEntries(fields.map((field) => [field, row[field] ?? '']))
    )

    const worksheet = XLSX.utils.json_to_sheet(exportRows, { header: fields })
    worksheet['!cols'] = fields.map((field) => ({
      wch: Math.max(field.length + 4, 16),
    }))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SHD Results')
    XLSX.writeFile(workbook, `SHD-Results-${new Date().toISOString().slice(0, 10)}.xlsx`)

    addLog(`Đã xuất ${rows.length} bản ghi ra Excel.`)
  }

  function resetData() {
    setRows([])
    setFileName('')
    setSearch('')
    addLog('Đã xóa dữ liệu khỏi phiên làm việc hiện tại.')
  }

  const stats = {
    total: rows.length,
    success: 0,
    pending: rows.length,
    errors: 0,
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-violet-400">
            <FileSpreadsheet size={15} />
            AUTOMATION WORKSPACE
          </div>
          <h1 className="mt-2 text-2xl font-bold">SHD Tool</h1>
          <p className="mt-2 text-sm text-gray-400">
            Nhập dữ liệu, kiểm tra bản ghi và chuẩn bị tác vụ xử lý SHD.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetData}
            disabled={!rows.length || busy}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-40"
          >
            <RotateCcw size={15} />
            Xóa dữ liệu
          </button>
          <button
            type="button"
            onClick={exportExcel}
            disabled={!rows.length || busy}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-medium transition hover:bg-violet-500 disabled:opacity-40"
          >
            <Download size={15} />
            Xuất Excel
          </button>
        </div>
      </div>

      <SHDStats stats={stats} />

      <section className="rounded-xl border border-white/10 bg-[#10131a] p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Trình duyệt website</h2>
            <p className="mt-1 text-xs text-gray-500">
              Mở website trong cửa sổ ứng dụng để chuẩn bị thao tác.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                if (!window.browserAPI) {
                  addLog('Không tìm thấy browserAPI. Hãy khởi động lại Electron.', 'error')
                  return
                }

                if (browserOpen) {
                  await window.browserAPI.hide()
                  setBrowserOpen(false)
                } else {
                  await window.browserAPI.show()
                  setBrowserOpen(true)
                }
              } catch (error) {
                addLog(error.message || 'Không thể điều khiển trình duyệt.', 'error')
              }
            }}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500"
          >
            {browserOpen ? 'Ẩn trình duyệt' : 'Hiện trình duyệt'}
          </button>
        </div>
        {browserOpen && <EmbeddedBrowser />}
      </section>


      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-white/10 bg-[#10131a] p-5">
          <div className="mb-4">
            <h2 className="font-semibold">Dữ liệu đầu vào</h2>
            <p className="mt-1 text-xs text-gray-500">
              Chọn file Excel có tiêu đề cột ở hàng đầu tiên.
            </p>
          </div>

          <ExcelUploader
            onFile={handleFile}
            fileName={fileName}
            rowCount={rows.length}
          />

          {busy && (
            <p className="mt-3 text-xs text-violet-300">Đang đọc file...</p>
          )}

          <p className="mt-3 text-xs leading-5 text-gray-500">
            Các cột dự kiến: SHD, TÊN KH, DOB, CMND/CCCD, SDT, GIN, Chức Danh, TÊN CTY, PB.
            Cột không khớp sẽ để trống trong bảng.
          </p>
        </section>

        <SHDControls
          concurrency={concurrency}
          setConcurrency={setConcurrency}
          timeout={timeout}
          setTimeoutValue={setTimeoutValue}
          onPrepare={prepareTasks}
          disabled={busy || rows.length === 0}
        />
      </div>

      <SHDTable rows={rows} search={search} setSearch={setSearch} />

      <div className="grid gap-5 xl:grid-cols-2">
        <SHDProgress total={rows.length} />
        <SHDLog logs={logs} />
      </div>
    </div>
  )
}
