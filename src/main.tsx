import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Autopartes from './pages/Autopartes';
import Marcas from './pages/Marcas';
import Modelos from './pages/Modelos';
import Piezas from './pages/Piezas';
import Clientes from './pages/Clientes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/autopartes" element={<Autopartes />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/modelos" element={<Modelos />} />
          <Route path="/piezas" element={<Piezas />} />
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
)
