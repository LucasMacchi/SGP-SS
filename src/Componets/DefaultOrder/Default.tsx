import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { IInsumo, IPedido, IServicio } from '../../Utils/Interfaces'

export default function DefaultOrder () {

    const navigator = useNavigate()
    const global = useContext(GlobalContext)
    const [insumos, setInsumos] = useState('')
    const [amount, setAmount] = useState(0)
    const [service, setService] = useState<IServicio>({
        service_des: '',
        service_id: 0,
        client_id: 0
    })

    useEffect(() => {
        if(global) {
            if(global.insumos.length === 0) global?.insumosFn()
            if(global.ccos.length === 0) global?.ccosFn()
            if(global.pedidos.length === 0 ) global.pedidosFn(global.user.rol)
        }
    },[])

    const handleDataSer = (service_id: number) => {
        const arr = global?.ccos.filter(ser => ser.service_id === service_id)
        if(arr) {
            setService({
                service_des: arr[0].service_des,
                service_id: arr[0].service_id,
                client_id: arr[0].client_id
            })
        }
    }

        const addIns = () => {
            if(amount && insumos) {
                const insu: IInsumo = {insumo_des: insumos, amount: amount ? amount : 1}
                setAmount(0)
                setInsumos('')
            }
            else alert('Error a agregar Insumo.')
        }
        /*
        const delIns = () => {
            newOrder.insumos.pop()
            setOrder({...newOrder})
        }
        */
    const displayForms = () => {
        return(
            <div>
                <div className='data-div-add'>
                    <h4>Centro de Costo: </h4>
                    <select defaultValue={''} value={service.service_id} className="data-div-select-big"
                    onChange={e => handleDataSer(parseInt(e.target.value))}>
                    <option value={''}>---</option>
                    {
                        global?.ccos.map((c) => (
                            <option key={c.service_id} value={c.service_id}>{c.service_des}</option>
                        ))
                    }
                    </select>
                </div>
                <div className='data-div-add'>
                    <h4>Insumo: </h4>
                    <select defaultValue={''} value={insumos} className="data-div-select-big"
                    onChange={e => setInsumos(e.target.value)}>
                    <option value={''}>---</option>
                    {
                        global?.insumos.map((i, index) => (
                            <option key={index} value={i}>{i}</option>
                        ))
                    }
                    </select>
                </div>
                <div className="data-div-btn-insumo">
                    <button className='data-del-btn-insumo' /*onClick={() => delIns()}*/>
                        Eliminar
                    </button>   
                    <button className='data-add-btn-insumo' onClick={() => addIns()}>
                        Agregar
                    </button>
                </div>
            </div>

        )
    }
    return(
        <div>
            <img src="/logo_big.webp" alt="" 
            className='logo-big-home'/>
            <div className='div-header-pedidos'>
                <button className='btn-small-logout' onClick={() => navigator('/pedidos')}>
                    Volver
                </button>
                <h1 className='title-Homepage' >
                    {'Pedido preterminado'}
                </h1>
            </div>
            <hr color='#666666' className='hr-line'/>
            {displayForms()}
        </div>
    )
}