import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import './informes.css'
import lastMonth from '../../Utils/lastMonth'
import { IInsumo, IpedidoClientDataPDF } from '../../Utils/Interfaces'
import {pdf} from '@react-pdf/renderer';
import { saveAs } from 'file-saver'
import ClientDocument from '../pdfs/client'
import Header from '../Header/Header'

export default function InformesPage () {
    const global = useContext(GlobalContext)
    const [startDate, setStartDate] = useState(lastMonth())
    const [endDate, setEndDate] = useState('')
    const [client, setClient] = useState(0)

    useEffect(() => {
        setStartDate(lastMonth())
    },[])

    const setClientsSelect = () => {
        let aux: number = 0
        const data = global?.ccos.map((s) => {
            if(!aux) {
                aux = s.client_id
                return {cliente_id: s.client_id, cliente_des: s.client_des}
            }
            else{
                if(s.client_id !== aux) {
                    aux = s.client_id
                    return {cliente_id: s.client_id, cliente_des: s.client_des}
                }
            }
        })
        return data?.filter(s => s)
    }

    const clientNameReturner = (clienteId: number): string => {
        const arr = setClientsSelect()
        const name = arr?.filter((c) => c?.cliente_id === clienteId)[0]?.cliente_des
        return name ?? 'No name'
        
    }

    const generateClientPDF = async () => {
        if(startDate && endDate && client){
            const response = await global?.generateClientPDF(client, startDate, endDate)
            if(response) {
                const insumosFormat: IInsumo[] = response.map((i) => {
                    const format = i.insumo_des.split('-')
                    const cod = parseInt(format[0])
                    const cod1 = parseInt(format[1])
                    const cod2 = parseInt(format[2])
                    const cod3 = parseInt(format[3])
                    const data: IInsumo = {
                        insumo_id: Number.isNaN(cod) ? 0 : cod,
                        ins_cod1: Number.isNaN(cod1) ? 0 : cod1,
                        ins_cod2: Number.isNaN(cod2) ? 0 : cod2,
                        ins_cod3: Number.isNaN(cod3) ? 0 : cod3,
                        insumo_des: format[4],
                        amount: i.sum
                    }
                    return data
                })
                const clientedes = clientNameReturner(client)
                const data: IpedidoClientDataPDF = {
                    pedido_client: clientedes,
                    pedido_start: startDate,
                    pedido_end: endDate,
                    pedido_client_id: client,
                    pedido_insumos: insumosFormat
                }
                const blob: Blob = await pdf(<ClientDocument pedido={data}/>).toBlob()
                saveAs(blob, ''+clientedes)
            } else alert('No existen datos del pedido.')

        }
        else{
            alert('Seleccione fechas y clientes validos.')
        }
        
    }

    return(
        <div>
            <div>
                <div className='div-informes-header'>
                    <Header />
                </div>
                <h1 className='title-Homepage' >
                        Informes
                </h1>
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Informe de pedidos por cliente
                    </h2>
                    <h5 className='filter-sub'>Cliente</h5>
                    <select defaultValue={''}
                    value={client} onChange={(e) => setClient(parseInt(e.target.value))} className='select-small-cco'>
                        <option value={''}>---</option>
                        {
                            setClientsSelect()?.map((cco) => (
                                <option key={cco?.cliente_id} value={cco?.cliente_id}>{cco?.cliente_id+'-'+cco?.cliente_des}</option>
                            ))
                        }
                    </select>
                    <div>
                    <h5 className='filter-sub'>Fecha de inicio y Final</h5>
                    <input type='date' id='date_start' className='date-input'
                    value={startDate} onChange={e => setStartDate(e.target.value)}/>
                    <a> - </a>
                    <input type='date' id='date_end' className='date-input'
                    value={endDate} onChange={e => setEndDate(e.target.value)}/>
                    </div>
                    <button className='btn-big' onClick={() => generateClientPDF()}>
                        Generar
                    </button>
                </div>
            </div>
        </div>
    )
}