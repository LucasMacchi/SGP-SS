import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GlobalState from './Context/GlobalContext.tsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PaginaPedidos from './Componets/Pedidos/Pagina.tsx'
import AdminPagina from './Componets/Admin/AdminPage.tsx'
import AddOrder from './Componets/AddOrder/AddOrder.tsx'
import DetailsPage from './Componets/Details/DetailsPage.tsx'
import UsersPagina from './Componets/Users/Users.tsx'
import InformesPage from './Componets/InformesPage/InformesPage.tsx'
import Correopage from './Componets/Correo/Correopage.tsx'
import Report from './Componets/Reporte/Report.tsx'
import ReportPage from './Componets/Reporte/ReportPage.tsx'
import Provisorio from './Componets/Provisorios/Provisorios.tsx'
import ServicesPage from './Componets/Servicios/ServicesPage.tsx'
import Soporte from './Componets/Soporte/Soporte.tsx'
import Compras from './Componets/Compras/Compras.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GlobalState>
      <StrictMode>
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route path='/reportes' element={<ReportPage />}></Route>
          <Route path='/soporte' element={<Soporte />}></Route>
          <Route path='/reportar/:orderId' element={<Report />}></Route>
          <Route path='/provisorio/:orderId' element={<Provisorio />}/>
          <Route path='/pedidos' element={<PaginaPedidos />} />
          <Route path='/informes' element={<InformesPage />} />
          <Route path='/services' element={<ServicesPage/>} />
          <Route path='/pedidos/:orderId' element={<DetailsPage />}/>
          <Route path='/admin' element={<AdminPagina/>}/>
          <Route path='/admin/users' element={<UsersPagina/>}/>
          <Route path='/correo' element={<Correopage/>}/>
          <Route path='/compras' element={<Compras/>}/>
          <Route path='/add' element={<AddOrder/>}/>
          <Route path='/add/:orderId' element={<AddOrder/>}/>
        </Routes>
      </StrictMode>
    </GlobalState>
  </BrowserRouter>


)
