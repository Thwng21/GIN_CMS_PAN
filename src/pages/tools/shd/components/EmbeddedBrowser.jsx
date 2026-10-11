import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCw, Globe } from 'lucide-react'

export default function EmbeddedBrowser() {
  const [url, setUrl] = useState('https://example.com')
  const [currentUrl, setCurrentUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const viewportRef = useRef(null)

  useEffect(() => {
    const api = window.browserAPI

    if (!api) {
      setError('Không tìm thấy browserAPI. Hãy khởi động lại ứng dụng.')
      return
    }

    const updateBounds = () => {
      const el = viewportRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      api.setBounds({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }

    const observer = new ResizeObserver(updateBounds)
    if (viewportRef.current) observer.observe(viewportRef.current)

    window.addEventListener('resize', updateBounds)
    window.addEventListener('scroll', updateBounds, true)
    updateBounds()

    const unsubscribe = api.onUrlChanged((nextUrl) => {
      setCurrentUrl(nextUrl)
      setUrl(nextUrl)
    })

    api.getUrl()
      .then((value) => {
        if (value) {
          setCurrentUrl(value)
          setUrl(value)
        }
      })
      .catch(() => {})

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateBounds)
      window.removeEventListener('scroll', updateBounds, true)
      unsubscribe()
      api.setBounds({ x: 0, y: 0, width: 0, height: 0 })
    }
  }, [])

  async function navigate(event) {
    event.preventDefault()

    let target = url.trim()
    if (!target) return

    if (!/^https?:\/\//i.test(target)) target = `https://${target}`

    try {
      setLoading(true)
      setError('')
      const result = await window.browserAPI.open(target)
      setCurrentUrl(result.url || target)
      setUrl(result.url || target)
    } catch (err) {
      setError(err?.message || 'Không thể mở website.')
    } finally {
      setLoading(false)
    }
  }

  async function runAction(action) {
    try {
      setError('')
      await window.browserAPI[action]()
    } catch (err) {
      setError(err?.message || 'Thao tác thất bại.')
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#10131a]">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
        <button type="button" title="Quay lại" onClick={() => runAction('back')}
          className="rounded-lg p-2 text-gray-300 hover:bg-white/10">
          <ArrowLeft size={16} />
        </button>

        <button type="button" title="Tiến tới" onClick={() => runAction('forward')}
          className="rounded-lg p-2 text-gray-300 hover:bg-white/10">
          <ArrowRight size={16} />
        </button>

        <button type="button" title="Tải lại" onClick={() => runAction('reload')}
          className="rounded-lg p-2 text-gray-300 hover:bg-white/10">
          <RotateCw size={16} />
        </button>

        <form onSubmit={navigate} className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#0b0d12] px-3">
            <Globe size={15} className="shrink-0 text-gray-500" />
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Nhập URL website..."
              className="w-full min-w-0 bg-transparent py-2 text-sm text-gray-200 outline-none"
            />
          </div>
          <button type="submit" disabled={loading}
            className="rounded-lg bg-violet-600 px-3 py-2 text-sm hover:bg-violet-500 disabled:opacity-50">
            {loading ? 'Đang mở...' : 'Đi đến'}
          </button>
        </form>
      </div>

      {error && (
        <p className="border-b border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="px-4 py-2 text-xs text-gray-500">
        {currentUrl || 'Nhập địa chỉ web ở trên'}
      </div>

      <div
        ref={viewportRef}
        className="relative min-h-[420px] border-t border-white/5 bg-[#0b0d12]"
      />
    </section>
  )
}
