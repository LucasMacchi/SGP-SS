import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header'
import { IChangeData } from '../../Utils/Interfaces'

export default function Provisorio () {

    const [service, setService] = useState(0)
    const global = useContext(GlobalContext)
    const navigator = useNavigate()

    useEffect(() => {
        if(global?.login === false) global?.sessionFn()
        if(global?.ccos.length === 0) global?.ccosFn()
        if(!global?.pedidoDetail.order_id) navigator('/')
    },[])


    const changeCco = async (e: React.MouseEvent) => {
        e.preventDefault()
        const client_id = global?.ccos.filter(c => c.service_id === service)[0].client_id
        setService(0)
        if(client_id && global) {
            const data: IChangeData = {
                service_id: service,
                client_id: client_id
            }
            global.modProvisorios(data, global.pedidoDetail.order_id)
        }

    }

    return(
        <div>
            <div className='div-header-pedidos'>
                <Header />
            </div>
            <h2 className='title-Homepage' >
                {'Provisorio'}
            </h2>
            <hr color='#3399ff' className='hr-line'/>
            <h2 className='title-Homepage' >
                {'Pedido Nro: '+global?.pedidoDetail.numero}
            </h2>
            <hr color='#3399ff' className='hr-line'/>
            <form>
            <div className='data-div-add'>
                <h4>Centro de Costo: </h4>
                <select defaultValue={''} value={service} className="select-small-cco"
                onChange={e => setService(parseInt(e.target.value))}>
                <option value={''}>---</option>
                {
                    global?.ccos.map((c) => (
                        <option key={c.service_id} value={c.service_id}>{c.service_des}</option>
                    ))
                }
                </select>
            </div>
                <button disabled={!(service)} className='btn-small' type='submit' onClick={(e) => changeCco(e)}>Modificar</button>
            </form>

        </div>
    )

}
