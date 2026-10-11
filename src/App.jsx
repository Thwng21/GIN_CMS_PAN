
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './layouts/AppLayout'
import OverviewPage from './pages/OverviewPage'
import ToolsPage from './pages/ToolsPage'
import SettingsPage from './pages/SettingsPage'

import SHDPage from './pages/tools/SHDPage'
import GINPage from './pages/tools/GINPage'
import PANPage from './pages/tools/PANPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/shd" element={<SHDPage />} />
          <Route path="/tools/gin" element={<GINPage />} />
          <Route path="/tools/pan" element={<PANPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
