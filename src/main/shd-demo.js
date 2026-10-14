
(() => {
  const existing = document.getElementById('__SHD_DEMO_UI__')

  if (existing) {
    existing.remove()
    return
  }

  const panel = document.createElement('div')
  panel.id = '__SHD_DEMO_UI__'

  Object.assign(panel.style, {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: '2147483647',
    width: '260px',
    padding: '18px',
    borderRadius: '12px',
    background: '#111827',
    color: '#ffffff',
    font: '14px Arial, sans-serif',
    boxShadow: '0 8px 30px #0006'
  })

  const title = document.createElement('div')
  title.textContent = 'SHD Demo Tool'
  title.style.cssText = 'font-size:18px;font-weight:bold;margin-bottom:8px'

  const description = document.createElement('p')
  description.textContent = 'Môi trường kiểm thử cục bộ'
  description.style.cssText = 'color:#cbd5e1;margin:0 0 14px'

  const fillButton = document.createElement('button')
  fillButton.textContent = 'Điền dữ liệu mẫu'
  fillButton.style.cssText =
    'width:100%;padding:10px;border:0;border-radius:7px;background:#10b981;color:#052e16;cursor:pointer'

  const status = document.createElement('p')
  status.style.cssText = 'margin:12px 0 0;color:#a7f3d0'

  fillButton.addEventListener('click', () => {
    const sample = {
      SHD: 'TEST-SHD-002',
      TEN_KH: 'Tran Thi B',
      DOB: '02/02/1992',
      CMND_CCCD: '111111111111',
      SDT: '0911111111',
      GIN: 'TEST-GIN-002',
      CHUC_DANH: 'Nhan vien thu nghiem',
      TEN_CTY: 'Cong ty demo',
      PB: 'Phong kiem thu'
    }

    let filled = 0

    for (const [id, value] of Object.entries(sample)) {
      const field = document.getElementById(id)

      if (field instanceof HTMLInputElement) {
        field.value = value
        field.dispatchEvent(new Event('input', { bubbles: true }))
        field.dispatchEvent(new Event('change', { bubbles: true }))
        filled++
      }
    }

    status.textContent = `Đã điền ${filled}/${Object.keys(sample).length} trường.`
  })

  const closeButton = document.createElement('button')
  closeButton.textContent = 'Đóng bảng'
  closeButton.style.cssText =
    'width:100%;margin-top:8px;padding:9px;border:1px solid #64748b;border-radius:7px;background:transparent;color:white;cursor:pointer'
  closeButton.addEventListener('click', () => panel.remove())

  panel.append(title, description, fillButton, status, closeButton)
  document.body.appendChild(panel)

  console.log('[SHD DEMO] Đã nạp script thử nghiệm.')
})()
