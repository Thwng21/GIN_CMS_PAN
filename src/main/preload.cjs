const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('appInfo', {
  name: 'SHD Tools V2',
  version: '2.0.0',
})

contextBridge.exposeInMainWorld('browserAPI', {
  open: (url) => ipcRenderer.invoke('browser:open', url),

  show: () => ipcRenderer.invoke('browser:show'),

  hide: () => ipcRenderer.invoke('browser:hide'),

  setBounds: (bounds) => {
    ipcRenderer.send('browser:set-bounds', bounds)
  },

  back: () => ipcRenderer.invoke('browser:back'),

  forward: () => ipcRenderer.invoke('browser:forward'),

  reload: () => ipcRenderer.invoke('browser:reload'),

  getUrl: () => ipcRenderer.invoke('browser:get-url'),

  loadShdTool: () => {
    return ipcRenderer.invoke('browser:load-shd-tool')
  },

  onUrlChanged: (callback) => {
    if (typeof callback !== 'function') {
      return () => {}
    }

    const listener = (_event, url) => callback(url)

    ipcRenderer.on('browser:url-changed', listener)

    return () => {
      ipcRenderer.removeListener('browser:url-changed', listener)
    }
  },
})