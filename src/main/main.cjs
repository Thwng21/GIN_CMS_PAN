const { app, BrowserWindow, WebContentsView, ipcMain } = require('electron')
const path = require('path')

const isDev = !app.isPackaged

let win
let browserView = null
let browserVisible = false
let lastBounds = { x: 0, y: 0, width: 0, height: 0 }

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
  })
}

function isAllowedUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
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
    if (isAllowedUrl(url)) browserView.webContents.loadURL(url)
    return { action: 'deny' }
  })

  applyBounds()
}

function applyBounds() {
  if (!browserView) return

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

ipcMain.on('browser:set-bounds', (event, bounds) => {
  if (!win || event.sender !== win.webContents || !bounds) return

  const values = ['x', 'y', 'width', 'height'].map((key) => bounds[key])
  if (!values.every((value) => Number.isFinite(value))) return
  if (bounds.width < 0 || bounds.height < 0) return

  lastBounds = {
    x: bounds.x,
    y: bounds.y,
    width: Math.min(bounds.width, 5000),
    height: Math.min(bounds.height, 5000),
  }

  applyBounds()
})

ipcMain.handle('browser:open', async (_event, value) => {
  if (!win) throw new Error('Cửa sổ ứng dụng chưa sẵn sàng')
  if (!isAllowedUrl(value)) {
    throw new Error('URL không hợp lệ. Hãy dùng địa chỉ HTTP hoặc HTTPS.')
  }

  ensureBrowser()
  browserVisible = true
  applyBounds()

  await browserView.webContents.loadURL(value)
  return { ok: true, url: browserView.webContents.getURL() }
})

ipcMain.handle('browser:show', () => {
  ensureBrowser()
  browserVisible = true
  applyBounds()
  return { ok: true }
})

ipcMain.handle('browser:hide', () => {
  browserVisible = false
  applyBounds()
  return { ok: true }
})

ipcMain.handle('browser:back', () => {
  if (browserView?.webContents.canGoBack()) browserView.webContents.goBack()
  return { ok: true }
})

ipcMain.handle('browser:forward', () => {
  if (browserView?.webContents.canGoForward()) browserView.webContents.goForward()
  return { ok: true }
})

ipcMain.handle('browser:reload', () => {
  browserView?.webContents.reload()
  return { ok: true }
})

ipcMain.handle('browser:get-url', () => browserView?.webContents.getURL() || '')

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
