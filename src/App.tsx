import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from './Context/GlobalContext'
import './App.css'

console.log('MOCKS '+import.meta.env.VITE_USE_MOCK)
const LOGS = import.meta.env.VITE_USE_LOGS

function App() {

  const [username, setUsername] = useState('')
  const global = useContext(GlobalContext)

  useEffect( () => {
    global?.sessionFn()
    if(LOGS) ping()
  },[])

  const handleUsername = (event: any) => {
    setUsername(event.target.value)
  }

  const ping = async () => {
    console.log(await global?.pingServer())
  }

  const loginAction = () => {
    global?.loginFn(username)
    setUsername('')
  }

  return (
    <div className='app-div'>
      <img src="/logo_big.webp" alt="" className='logo-big-home'/>
      <h1 className='title-Homepage'>Sistema de Gestion de Pedidos</h1>
      <hr color='#3399ff'/>
      <h2 className='logintext'>Ingrese el Usuario</h2>
      <div className='div-login-input'>
        <input type='text' id='username' size={20} className='textfield-login'
        value={username} onChange={e => handleUsername(e)}/>
      </div>
      <button className='btn-small' onClick={loginAction}>Ingresar</button>
    </div>
  )
  
}

export default App
