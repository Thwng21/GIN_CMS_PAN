
const { app, BrowserWindow, WebContentsView, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs/promises')

const isDev = !app.isPackaged

let win = null
let browserView = null
let browserVisible = false
let lastBounds = { x: 0, y: 0, width: 0, height: 0 }

// Cho phép trình duyệt mở website HTTP/HTTPS.
function isAllowedUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

// Website nghiệp vụ được phép chạy SHD V6 thật.
function isAllowedShdPage(value) {
  try {
    const url = new URL(value)

    return (
      url.protocol === 'http:' &&
      url.hostname === '171.244.43.91' &&
      url.pathname.startsWith('/danang/')
    )
  } catch {
    return false
  }
}

// Trang thử nghiệm chỉ được dùng khi chạy chế độ development.
function isLocalDemoPage(value) {
  try {
    const url = new URL(value)

    return (
      isDev &&
      url.protocol === 'http:' &&
      url.hostname === 'localhost' &&
      url.port === '5173' &&
      url.pathname === '/shd-test.html'
    )
  } catch {
    return false
  }
}

function isMainRenderer(event) {
  return Boolean(
    win &&
    !win.isDestroyed() &&
    event.sender === win.webContents
  )
}

function applyBounds() {
  if (!browserView || browserView.webContents.isDestroyed()) return

  const b = lastBounds

  browserView.setBounds(
    browserVisible
      ? {
          x: Math.max(0, Math.round(b.x)),
          y: Math.max(0, Math.round(b.y)),
          width: Math.max(0, Math.round(b.width)),
          height: Math.max(0, Math.round(b.height)),
        }
      : { x: 0, y: 0, width: 0, height: 0 }
  )
}

function ensureBrowser() {
  if (browserView || !win) return

  browserView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  win.contentView.addChildView(browserView)

  const sendUrl = (_event, url) => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('browser:url-changed', url)
    }
  }

  browserView.webContents.on('did-navigate', sendUrl)
  browserView.webContents.on('did-navigate-in-page', sendUrl)

  browserView.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedUrl(url) && browserView) {
      browserView.webContents.loadURL(url).catch((error) => {
        console.error('[Browser] Không mở được URL:', error.message)
      })
    }

    return { action: 'deny' }
  })

  browserView.webContents.on('destroyed', () => {
    browserView = null
  })

  browserView.webContents.on('render-process-gone', (_event, details) => {
    console.error('[Browser] Renderer bị dừng:', details.reason)
  })

  applyBounds()
}

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: 'SHD Tools V2',
    backgroundColor: '#0f1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  win.on('resize', applyBounds)

  win.on('closed', () => {
    win = null
    browserView = null
    browserVisible = false
  })
}

// Cập nhật vị trí và kích thước trình duyệt nhúng.
ipcMain.on('browser:set-bounds', (event, bounds) => {
  if (!isMainRenderer(event) || !bounds || typeof bounds !== 'object') {
    return
  }

  const values = ['x', 'y', 'width', 'height'].map(
    (key) => bounds[key]
  )

  if (!values.every(Number.isFinite)) return
  if (bounds.width < 0 || bounds.height < 0) return

  lastBounds = {
    x: bounds.x,
    y: bounds.y,
    width: Math.min(bounds.width, 5000),
    height: Math.min(bounds.height, 5000),
  }

  applyBounds()
})

// Mở website.
ipcMain.handle('browser:open', async (event, value) => {
  if (!isMainRenderer(event)) {
    throw new Error('Yêu cầu không hợp lệ.')
  }

  if (!isAllowedUrl(value)) {
    throw new Error('URL không hợp lệ. Hãy dùng HTTP hoặc HTTPS.')
  }

  ensureBrowser()
  browserVisible = true
  applyBounds()

  await browserView.webContents.loadURL(value)

  return {
    ok: true,
    url: browserView.webContents.getURL(),
  }
})

// Hiện trình duyệt.
ipcMain.handle('browser:show', (event) => {
  if (!isMainRenderer(event)) {
    throw new Error('Yêu cầu không hợp lệ.')
  }

  ensureBrowser()
  browserVisible = true
  applyBounds()

  return { ok: true }
})

// Ẩn trình duyệt.
ipcMain.handle('browser:hide', (event) => {
  if (!isMainRenderer(event)) {
    throw new Error('Yêu cầu không hợp lệ.')
  }

  browserVisible = false
  applyBounds()

  return { ok: true }
})

// Quay lại.
ipcMain.handle('browser:back', (event) => {
  if (!isMainRenderer(event)) {
    throw new Error('Yêu cầu không hợp lệ.')
  }

  if (browserView?.webContents.canGoBack()) {
    browserView.webContents.goBack()
  }

  return { ok: true }
})

// Tiến tới.
ipcMain.handle('browser:forward', (event) => {
  if (!isMainRenderer(event)) {
    throw new Error('Yêu cầu không hợp lệ.')
  }

  if (browserView?.webContents.canGoForward()) {
    browserView.webContents.goForward()
  }

  return { ok: true }
})

// Tải lại trang.
ipcMain.handle('browser:reload', (event) => {
  if (!isMainRenderer(event)) {
    throw new Error('Yêu cầu không hợp lệ.')
  }

  browserView?.webContents.reload()

  return { ok: true }
})

// Lấy URL hiện tại.
ipcMain.handle('browser:get-url', (event) => {
  if (!isMainRenderer(event)) {
    throw new Error('Yêu cầu không hợp lệ.')
  }

  return browserView?.webContents.getURL() || ''
})

// Nạp script demo hoặc SHD V6 theo website hiện tại.

ipcMain.handle('browser:load-shd-tool', async (event) => {
  if (!isMainRenderer(event)) {
    throw new Error('Yêu cầu không hợp lệ.')
  }

  if (!browserView || browserView.webContents.isDestroyed()) {
    throw new Error('Hãy mở website trong trình duyệt nhúng trước.')
  }

  const currentUrl = browserView.webContents.getURL()
  console.log('[SHD] URL hiện tại:', currentUrl)

  let scriptPath
  let mode

  if (isLocalDemoPage(currentUrl)) {
    // Giao diện SHD V6 thật, nhưng khóa tra cứu và lưu nghiệp vụ.
    scriptPath = path.join(__dirname, 'shd-v6-preview.js')
    mode = 'preview'
  } else if (isAllowedShdPage(currentUrl)) {
    // Dùng nguyên script nghiệp vụ gốc trên website được phép.
    scriptPath = path.join(__dirname, 'shd-v6.js')
    mode = 'production'
  } else {
    throw new Error(
      `Trang hiện tại không nằm trong danh sách thử nghiệm/nghiệp vụ: ${currentUrl}`
    )
  }

  let script

  try {
    script = await fs.readFile(scriptPath, 'utf8')
  } catch (error) {
    console.error('[SHD] Không đọc được script:', error)
    throw new Error(`Không tìm thấy hoặc không đọc được file: ${scriptPath}`)
  }

  if (!script.trim()) {
    throw new Error('File script đang trống.')
  }

  await browserView.webContents.executeJavaScript(script, true)

  const message = mode === 'preview'
    ? 'Đã nạp giao diện SHD V6 Preview; tra cứu và lưu đã khóa.'
    : 'Đã nạp SHD V6 trên website nghiệp vụ.'

  console.log('[SHD]', message)

  return {
    ok: true,
    mode,
    url: browserView.webContents.getURL(),
    message,
  }
})


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
