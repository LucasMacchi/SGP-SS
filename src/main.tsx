import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GlobalState from './Context/GlobalContext.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PaginaPedidos from './Componets/Pedidos/Pagina.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GlobalState>
      <StrictMode>
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route path='/pedidos' element={<PaginaPedidos />} />
        </Routes>
      </StrictMode>
    </GlobalState>
  </BrowserRouter>


)
