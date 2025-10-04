import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './layout/dashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <Dashboard /> 
)
