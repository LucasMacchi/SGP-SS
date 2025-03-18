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

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GlobalState>
      <StrictMode>
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route path='/pedidos' element={<PaginaPedidos />} />
          <Route path='/pedidos/:orderId' element={<DetailsPage />}/>
          <Route path='/admin' element={<AdminPagina/>}/>
          <Route path='/admin/users' element={<UsersPagina/>}/>
          <Route path='/add' element={<AddOrder/>}/>
          <Route path='/add/:orderId' element={<AddOrder/>}/>
        </Routes>
      </StrictMode>
    </GlobalState>
  </BrowserRouter>


)
