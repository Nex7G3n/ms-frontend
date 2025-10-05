import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Dashboard from './layout/dashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navbar />
    <div style={{ padding: '16px' }}>
      <Dashboard />
    </div>
  </StrictMode>
)
