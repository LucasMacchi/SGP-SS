import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import './informes.css'
import lastMonth from '../../Utils/lastMonth'
import { IClientIns, ICollectionoRes, ICollectionPDF, IInsumo, IpedidoClientDataPDF } from '../../Utils/Interfaces'
import {pdf} from '@react-pdf/renderer';
import { saveAs } from 'file-saver'
import ClientDocument from '../pdfs/client'
import Header from '../Header/Header'
import CollectionDocument from '../pdfs/collection'
import RemitoDocument, { divisionTable} from '../pdfs/remito'
import infoMsg from '../../Utils/infoMsg'
import RemitoDocumentCol from '../pdfs/remitoColeccion'


export default function InformesPage () {
    const global = useContext(GlobalContext)
    const [startDate, setStartDate] = useState(lastMonth())
    const [endDate, setEndDate] = useState('')
    const [client, setClient] = useState(0)
    const [userReq, setUser] = useState(0)
    const [collection, setCollection] = useState('')
    const [orders, setOrders] = useState<string[]>([])
    const [remit, setRemit] = useState(false)

    useEffect(() => {
        setStartDate(lastMonth())
        if(global?.ccos.length === 0) global.ccosFn()
        if(global?.sysUsers.length === 0) global.sysUsersFn()
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

    useEffect(() => {
        const col: string | null = localStorage.getItem(collection)
        if(localStorage.getItem(collection) && col) {
            setOrders(JSON.parse(col))
        }
        else setOrders([])
    },[collection])

    const generateClientPDF = async () => {
        if(startDate && endDate && client){
            const response = await global?.generateClientPDF(client, startDate, endDate, userReq)
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
                        amount: Math.round(i.sum * 100) / 100
                    }
                    return data
                })
                console.log(insumosFormat)
                if(insumosFormat.length > 0) {
                    if(remit) await createRemito(insumosFormat, true)
                    else await createClientePdf(insumosFormat)
                } else alert('No existen datos del pedido.')
                

            } else alert('No existen datos del pedido.')
            
        }
        else{
            alert('Seleccione fechas y clientes validos.')
        }
        
    }

    const createRemito = async (insumos: IInsumo[], cliente: boolean) => {
        const dataF = divisionTable(insumos)
        const clientedes = clientNameReturner(client)
        const blob: Blob = await pdf(<RemitoDocument c={dataF} />).toBlob()
        if(cliente) saveAs(blob, 'REMITO_'+clientedes)
        else saveAs(blob, 'REMITO_'+collection)
    }

    const createRemitoColeccion = async () => {
        console.log("Pedidos: ",orders)
        const dataF = await global?.collectionRemito(orders)
        if(dataF && dataF.length > 0) {
            const blob: Blob = await pdf(<RemitoDocumentCol c={dataF} />).toBlob()
            saveAs(blob, 'REMITO_'+collection)
        }

    }

    const createClientePdf = async (insumos: IInsumo[]) => {
        let reqName = ''
        if(userReq) {
            global?.sysUsers.forEach((u) => {
                if(u.usuario_id === userReq) reqName = u.last_name +" "+u.first_name
            })
        }
        const clientedes = clientNameReturner(client)
        const data: IpedidoClientDataPDF = {
            pedido_client: clientedes,
            pedido_start: startDate,
            pedido_end: endDate,
            pedido_client_id: client,
            pedido_insumos: insumos,
            pedido_requester: reqName
        }
        const blob: Blob = await pdf(<ClientDocument pedido={data}/>).toBlob()
        saveAs(blob, ''+clientedes)
    }

    const deleteInsumoRow = (index: number, nro: string, orders: string[]) => {
        if(confirm('¿Quiere eliminar el pedido '+nro+ "?")){
            orders.splice(index, 1)
            localStorage.setItem(collection, JSON.stringify(orders))
            setOrders(orders)
            setCollection('')
        }
    }

    const deleteCollection = () => {
        if(collection && confirm('Quieres eliminar los pedidos de la coleccion?')) {
            localStorage.removeItem(collection)
            setCollection('')
        }
        else {
            alert('Coleccion no tiene pedidos.')
        }
    }

    const requestCollection = async () => {
        if(orders.length > 0) {
            const res = await global?.collectionOrders(orders)
            if(res) {
                if(remit) {
                    await createRemitoColeccion()
                }
                else{
                    await printCollection(res)
                }

            }

        }
        else alert('Selecciones uno o mas pedidos.')
    }

    const printCollection = async (res: ICollectionoRes) => {
        let insumos: IClientIns[] = []
        insumos = res.insumos.map((i) => {
            const format = i.insumo_des.split('-')
            const cod = parseInt(format[0])
            const cod1 = parseInt(format[1])
            const cod2 = parseInt(format[2])
            const cod3 = parseInt(format[3])
            const data: IClientIns = {
                insumo_id: Number.isNaN(cod) ? 0 : cod,
                ins_cod1: Number.isNaN(cod1) ? 0 : cod1,
                ins_cod2: Number.isNaN(cod2) ? 0 : cod2,
                ins_cod3: Number.isNaN(cod3) ? 0 : cod3,
                insumo_des: format[4],
                sum: Math.round(i.sum * 100) / 100
            }
            return data
        })
        const data: ICollectionPDF = {
            collection: {
                insumos: insumos,
                orders: res.servicios
            }
        }
        const blob: Blob = await pdf(<CollectionDocument collection={data.collection}/>).toBlob()
        saveAs(blob, 'SGP_'+collection)
    }

    const displaySelection = () => {
        return (
            <div className='table-div'>
                <div>
                <h5 className='filter-sub'>Selecciona la Coleccion</h5>
                <select value={collection} onChange={(e) => setCollection(e.target.value)} className='select-small'>
                  <option value={''}>---</option>
                  <option value={'Coleccion1'}>Coleccion 1</option>
                  <option value={'Coleccion2'}>Coleccion 2</option>
                  <option value={'Coleccion3'}>Coleccion 3</option>
                  <option value={'Coleccion4'}>Coleccion 4</option>
                  <option value={'Coleccion5'}>Coleccion 5</option>
                </select>
                {orders.length > 0 && <button className='btn-export-pdf' onClick={() => requestCollection()}>Crear</button>}
                {orders.length > 0 && <button className='btn-export-pdf' onClick={() => deleteCollection()}>Eliminar</button>}
                <button className="info-popup" onClick={() => infoMsg(9)}>?</button>
            </div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th className='data-div-insumo-name-row'>Pedidos Seleccionados</th>
                        </tr>
                        {orders.map((o, i) => (
                            <tr key={o+i}>
                                <th key={o} onClick={() => deleteInsumoRow(i,o, orders)} className='data-div-insumo-name-row'>{o}</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        )
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
                <h5 className='filter-sub'>Los informes generados son sobre los pedidos </h5>
                <h5 className='filter-sub'>que ya estan Aprobados, Listos o Entregados.</h5>
                <h5 className='filter-sub'>Generar Remitos: <input type="checkbox" checked={remit} onChange={(e) => setRemit(e.target.checked)}/></h5>
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
                    <h5 className='filter-sub'>Solicitante</h5>
                    <select defaultValue={''}
                    value={userReq} onChange={(e) => setUser(parseInt(e.target.value))} className='select-small-cco'>
                    <option value={''}>---</option>
                    {
                        global?.sysUsers.map((u) => (
                            <option key={u.usuario_id} value={u.usuario_id}>{u.last_name + ' ' + u.first_name}</option>
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
                <hr color='#3399ff' className='hr-line'/>
                <div>
                    <h2 className='title-Homepage' >
                        Conjunto de Pedidos
                    </h2>
                    {displaySelection()}
                </div>
            </div>
        </div>
    )
}
