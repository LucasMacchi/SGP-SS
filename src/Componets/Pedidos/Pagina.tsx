import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'

export default function PaginaPedidos () {

    const global = useContext(GlobalContext)

    useEffect(() => {
        global?.pedidosFn(global.user.username, global.user.rol)
        global?.sessionFn()
    },[])

    return(
        <div>
            <img src="/logo_big.webp" alt="" 
            className='logo-big-home'/>
            <h1 className='title-Homepage' >
                Pedidos
            </h1>
            <hr color='#3399ff'/>


        </div>
    )
}