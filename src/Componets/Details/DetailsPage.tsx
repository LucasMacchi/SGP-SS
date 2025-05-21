import './Details.css'
import { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { IEntrega, IInsumo, IPedido, IpedidoDataPDF, IPersonal, rolesNum } from '../../Utils/Interfaces'
import dbDateParser from '../../Utils/dbDateParser'
import {pdf} from '@react-pdf/renderer';
import PedidoDocument from '../pdfs/pedido'
import Entrega from '../pdfs/entrega'
import { saveAs } from 'file-saver'
import Header from '../Header/Header'
import tokenExpireChecker from '../../Utils/tokenExpireChecker'
import dateParser from '../../Utils/dateParser'
import sectoresPersonal from "./sectores.json"


export default function DetailsPage () {
    
    const navigator = useNavigate()
    const params = useParams()
    const id = params.orderId
    const global = useContext(GlobalContext)
    const [order, setOrder] = useState<IPedido | null>(null)
    const [loading, setLoad] = useState(false)
    const [addIns, setAddIns] = useState(false)
    const [newIns, setNewAdd] = useState('')
    const [newAmount, setNewAmount] = useState(0)
    const [commnet, setComment] = useState<string>('')
    const [action, setAction] = useState(0)
    const [dateEntrega, setDateEntrega] = useState('')
    const [legajo, setLegajo] = useState(0)
    const [sector, setSector] = useState('')
    const [showLegajo, setShowLegajo] = useState(false)
    const [search, setSearch] = useState('')
    const [filteredArr, setFiltered] = useState<IPersonal[]>([])
    const [dni, setDni] = useState(0)
    const [fullname, setFullname] = useState('')


    useEffect(() => {
      if(sector) global?.getPersonalBySector(sector, false)
      else global?.getPersonalBySector(sector, true)
    },[sector])
    
    useEffect(() => {
      if(global && id && !tokenExpireChecker()){
          global.uniqPedido(parseInt(id), false)
          if(global.insumos.length === 0) global.insumosFn()
      }else{
          navigator('/')
      }
    },[])
    
    useEffect(() => {
      let array = global?.personal
      if(array){
        if(search.length > 0 && array) {
          array = array.filter(p => p.fullname.toLowerCase().includes(search.toLowerCase()))
        }
        setFiltered(array)
      }
    },[global?.personal, search])

    useEffect(() => {
      if(global) {
        setOrder(global?.pedidoDetail)
        getPersonal()
      }
    },[global?.pedidoDetail])
    
    const getPersonal = async (): Promise<IPersonal> => {
      if(global && order && order.legajo) {
        const persona = await global.getPersona(order.legajo)
        return persona
      }
      else return {legajo:0,fullname:'',cuil:0,sector:``}
    }
    
    const setPersonal = async (legajo: number) => {
      if(legajo){
        if(confirm('Quieres asignar el pedido a '+legajo) && global && order){
          const oldLegajo = order.legajo ? order.legajo : 0
          await global.orderLegajo(order.order_id, legajo)
          if(oldLegajo && oldLegajo > 1000000) await global.deletePersonal(oldLegajo)
        }
      }
      else {
        alert('Ingrese pesonal valido.')
      }
    }

    const rejectFn = (order_id: number) => {
        setLoad(true)
        if(confirm('¿Quieres rechazar el pedido?')) global?.orderRejectFn(order_id, commnet)
        else setLoad(false)
    }
    const aproveFn = (order_id: number) => {
      setLoad(true)
      if(confirm('¿Quieres aprobar el pedido?')) global?.orderAproveFn(order_id, commnet)
      else setLoad(false)
    }
    const cancelFn = (order_id: number) => {
      setLoad(true)
      if(confirm('¿Quieres cancelar el pedido?')) global?.orderCancelFn(order_id)
      else setLoad(false)
    }
    const deliverFn = (order_id: number) => {
      setLoad(true)
      if(confirm('¿Quieres informar la entrega del pedido? Al hacerlo, declara que el pedido se entrego correctamente.')) global?.orderDeliveredFn(order_id, commnet)
      else setLoad(false)
    }
    const problemFn = (order_id: number) => {
      setLoad(true)
      if(confirm('¿Quieres informar un problema? Al hacerlo, declara que el pedido no se entrego correctamente.')) global?.problemFn(order_id, commnet)
      else setLoad(false)
    }
    const readyFn = (order_id: number) => {
      setLoad(true)
      if(confirm('¿Quieres informar que el pedido esta Listo?')) global?.orderReadyFn(order_id)
      else setLoad(false)
    }
    const archiveFn = (order_id: number) => {
      setLoad(true)
      if(confirm('¿Quieres archivar el pedido?')) global?.orderArchFn(order_id)
      else setLoad(false)
    }
    const exportPdf = async () => {
        if(order) {
            const insumosFormat: IInsumo[] = order.insumos.map((i) => {
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
                    amount: i.amount
                }
                return data
            })
            const serv = servData(order?.service_id)
            const pedido: IpedidoDataPDF = {
                solicitante_email: order.email,
                solicitante_nombre: order.first_name,
                solicitante_apellido: order.last_name,
                solicitante_usuario: order.requester,
                pedido_numero: order.numero,
                pedido_req: order.date_requested,
                pedido_deli: order.date_delivered,
                pedido_apr: order.date_aproved,
                pedido_client: serv.clientdes,
                pedido_service: serv.serdes,
                pedido_client_id: serv.clientid,
                pedido_service_id: serv.serid,
                pedido_state: order.state,
                pedido_insumos: insumosFormat
            }
            const blob: Blob = await pdf(<PedidoDocument pedido={pedido}/>).toBlob()
            saveAs(blob, 'SGP-'+order.numero+'.pdf')
        }
    }
    
    const exportPdfEntrega = async () => {
        if(order && order.legajo && dateEntrega) {
          const d = dateParser(dateEntrega)
          const personal = await getPersonal()
          const entrega:IEntrega = {
            entrega: {
              fullname: personal.fullname,
              dni: personal.cuil,
              service: serviceDisplayer(order.service_id),
              fecha_entrega: d.day+'/'+d.month+'/'+d.year,
              insumos: order.insumos
            }
          } 
          const blob: Blob = 
            await pdf(<Entrega entrega={entrega.entrega}/>).toBlob()
            saveAs(blob, 'SGP-Plantilla-'+order.numero+'.pdf')
        }
        else {
          alert('Seleccione una fecha de entrega.')
        }
    }

    const deleteInsumoRow = async (_index: number, insumo: string, details_id: number | undefined) => {
        if(order && order.insumos.length > 1 && order.state === 'Pendiente' && global?.user.rol !== rolesNum.encargado && details_id) {
            if(confirm('¿Quiere eliminar el insumo '+insumo+ "?")){
                await global?.deleteInsumo(details_id)
            }
        }
    }

    const btnDisplay = () => {
        if(loading){
            return(
                <h3 className='title-Homepage'>Cargando...</h3>
            )
        }
        else if(global?.user.rol === rolesNum.encargado) {
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <button className='btn-negative' onClick={() => cancelFn(order.order_id)}>CANCELAR</button>
                        </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <h3 className='title-Homepage'>Esperando a que el pedido este listo.</h3>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <button className='btn-problem' onClick={() => problemFn(order.order_id)}>PROBLEMA</button>
                            <button className='btn-neutral' onClick={() => deliverFn(order.order_id)}>ENTREGADO</button>
                        </div>
                    )
                default:
                    return (
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => navigator('/add/'+id)}>REPETIR</button>
                        </div>
                    )

            }
        }
        else if(global?.user.rol === rolesNum.administrativo) {
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                default:
                    return(
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => archiveFn(order? order.order_id : 0)}>ARCHIVAR</button>
                        </div>
                    ) 

            }
        }
        else if(global?.user.rol === rolesNum.admin) {
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => aproveFn(order ? order.order_id : 0)}>APROBAR</button>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => readyFn(order ? order.order_id : 0)}>LISTO</button>
                            <button className='btn-negative' onClick={() => cancelFn(order? order.order_id : 0)}>CANCELAR</button>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => deliverFn(order.order_id)}>ENTREGADO</button>
                        </div>
                    )
                default:
                    return(
                        <div className='div-btns'>
                            <button className='btn-neutral' onClick={() => archiveFn(order? order.order_id : 0)}>ARCHIVAR</button>
                            <button className='btn-neutral' onClick={() => navigator('/add/'+id)}>REPETIR</button>
                        </div>
                    ) 

            }
        }
        else if(global?.user.rol === rolesNum.en_deposito){
            switch(order?.state){
                case 'Pendiente':
                    return(
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => aproveFn(order ? order.order_id : 0)}>APROBAR</button>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                    case 'Cancelado':
                        return(
                            <div className='div-btns'>
                                <h3 className='title-Homepage'>Pedido Cancelado</h3>
                            </div>
                        )
                    case 'Rechazado':
                        return(
                            <div className='div-btns'>
                                <h3 className='title-Homepage'>Pedido Rechazado</h3>
                            </div>
                    )
                case 'Aprobado':
                    return(
                        <div className='div-btns'>
                            <button className='btn-accept' onClick={() => readyFn(order ? order.order_id : 0)}>LISTO</button>
                            <button className='btn-negative' onClick={() => rejectFn(order? order.order_id : 0)}>RECHAZAR</button>
                        </div>
                    )
                case 'Listo':
                    return (
                        <div className='div-btns'>
                            <h3 className='title-Homepage'>Pedido listo, esperando entrega</h3>
                        </div>
                    )
                default:
                    return(
                        <div className='div-btns'>
                            <h3 className='title-Homepage'>Pedido entregado</h3>
                        </div>
                    ) 

            }
        }
        else navigator('/')
    }

    const serviceDisplayer = (id: number): string => {
        let srv = 'Servicio'
        global?.ccos.forEach(s => {
            if(id === s.service_id) srv= s.service_id+'-'+s.service_des
        });
        return srv
    }

    const servData = (id: number) => {
        const data = {
            serdes: '',
            clientdes: '',
            serid: 0,
            clientid: 0
        }
        global?.ccos.forEach(s => {
            if(id === s.service_id) {
                data.clientdes = s.client_des + ' - ' +s.localidad
                data.clientid = s.client_id
            }
        });
        return data
    }

    const classChange = (): string => {
        if(global?.user.rol !== 3){
            if(order?.state === 'Pendiente' && order.insumos.length > 1) return 'data-div-insumo-name-row'
            else return 'table-users'
        }
        else return 'table-users'
    }
    const commentText = () => {
        if((global?.user.rol === rolesNum.admin || global?.user.rol === rolesNum.administrativo || global?.user.rol === rolesNum.en_deposito) 
            && order?.state === "Pendiente"){
                return(
                    <div>
                        <h4 className='delete-text'>Comentarios</h4>
                        <textarea value={commnet} className='texarea-details'
                        onChange={(e) => setComment(e.target.value)}/>
                    </div>

                )
        }
        else if(global?.user.rol === rolesNum.encargado && order?.state === 'Listo'){
            return(
                <div>
                    <h4 className='delete-text'>Comentarios</h4>
                    <textarea value={commnet} className='texarea-details'
                    onChange={(e) => setComment(e.target.value)}/>
                </div>

            )
        }
    }
    const changeAmount = async (nm: number, detail_id: number | undefined) => {
        if(order && detail_id && order.state === 'Pendiente' && global?.user.rol !== 3) {
          const newA = prompt('Ingrese la nueva cantidad (utilize . en vez de ,) ', nm.toString()) ?? 0;
            if(newA === 0) return 0
            else if(newA && parseFloat(newA)) {
                const newAmNum = parseFloat(newA)
                await global?.changeAmountFn(detail_id, newAmNum)
                return 0
            } else changeAmount(nm, detail_id)
        }
    }

    const addNewInsumo = async () => {
        if(order && global && newIns && newAmount) {
            global.addInsumo( newIns, order.order_id,newAmount)
        }
        else alert('Ingrese un insumo y monto correcto.')
    }

    const checkToAdd = (): boolean => {
        if(order?.state === "Pendiente" && global?.user.rol === rolesNum.en_deposito) return true
        else return false
    }

    const displayActions = () => {
      if(action === 1) {
        return(
          <div>
            <div>
              <h5 className='filter-sub'>Fecha de entrega</h5>
              <input type='date' id='date_start' className='date-input'
              value={dateEntrega} onChange={e => setDateEntrega(e.target.value)}/>
            </div>
            <button className='btn-export-pdf' onClick={() => exportPdfEntrega()}>Exportar</button>
          </div>
        )
      }
      else if(action === 2) {
        return(
          <button className='btn-export-pdf' onClick={() => exportPdf()}>Exportar</button>
        )
      }
      else if(action === 3) {
        return(
          <button className='btn-export-pdf' onClick={() => navigator('/reportar/'+order?.numero)}>Reportar</button>
        )
      }
      else if(action === 4) {
        return(
          <button className='btn-export-txt'>Exportar</button>
        )
      }
      else if(action === 5) {
        return(
          <button className='btn-export-pdf' onClick={() => navigator('/provisorio/'+order?.numero)}>Asignar Servicio</button>
        )
      }
      else {
        return(
          <></>
        )
      }
    }
    
    const createPersonalLink = async () => {
      const personal: IPersonal = {
        cuil: dni,
        fullname: fullname,
        sector: sector,
        legajo: dni
      }
      if(dni && fullname && order) {
        await global?.createPersonal(personal)
        await setTimeout(() => {global?.orderLegajo(order.order_id, dni)},(1000))
      }
      else alert('Compruebe que los datos son correctos')

    }
    
    const displayLegajo = () => {
      if(showLegajo) {
        return(
          <div className='data-div-add'>
            <div>
            <h6>Sector</h6>
            <select value={sector} className="data-div-select"
            onChange={e => {
              setSearch('')
              setSector(e.target.value)}}>
            <option value={''}>---</option>
            {
                sectoresPersonal.sectores.map((s) => {
                    return(<option key={s} value={s}>{s}</option>)
                })
            }
            </select>
            </div>  
            <div className='data-div-add' >
                <h6 className={sector === 'PROVISORIO' ? "data-div-non"  : ''}>Busqueda por nombre de personal</h6>
                <input type="text" id='otherins' 
                className={sector === 'PROVISORIO' ? "data-div-non"  : 'data-div-select'}
                onChange={(e) => setSearch(e.target.value)} disabled={sector.length===0}
                value={search}/>
            </div>
              {sector === 'PROVISORIO' ?
                <div>
                  <div>
                    <h6>Apellido y Nombre</h6>
                    <input type="text" id='otherins' className="data-div-select" 
                    onChange={(e) => setFullname(e.target.value)} value={fullname}/>
                  </div>
                  <div>
                    <h6>CUIL</h6>
                    <input type="number" id='otherins' className="data-div-select" 
                    onChange={(e) => setDni(parseInt(e.target.value))} value={dni}/>
                  </div>
                  <button className='btn-export-pdf' onClick={() => createPersonalLink()}>Registrar</button>
                </div>
                :
                <div>
                  <h6>Personal -  {global?.personal.length && global?.personal.length - 1 + " Encontrados"}</h6>
                  <select value={legajo} className="data-div-select" disabled={sector.length===0}
                  onChange={e => {
                    setLegajo(parseInt(e.target.value))
                    setPersonal(parseInt(e.target.value))}}>
                  <option value={0}>---</option>
                  {
                      filteredArr.map((p) => {
                          return(<option key={p.legajo} value={p.legajo}>{p.legajo+'-'+p.fullname}</option>)
                      })
                  }
                  </select>
                </div>
              }

          </div>
        )
      }
    }
    
    const dataDisplay = () => {
        if(order) {
            return(
                <div className='data-div'>
                  <div>
                    <div>
                        <h5 className='filter-sub'>Otras Acciones</h5>
                        <select value={action} onChange={(e) => setAction(parseInt(e.target.value))} className='select-actions'>
                          <option value={0}>---</option>
                          {(order.legajo && global?.user.rol === rolesNum.en_deposito) && <option value={1}>Exportar plantilla de entrega</option>}
                          <option value={2}>Exportar a pdf</option>
                          <option value={3}>Reportar</option>
                          {global?.user.rol === rolesNum.admin && <option value={4}>Exportar a TXT</option>}
                          {order.prov && <option value={5}>Provisional</option>}
                        </select>
                        
                    </div>
                    <div>
                      {displayActions()}
                    </div>
                  </div>

                    <hr color='#666666' className='hr-details'/>
                    <h3>CCO: </h3>
                    <h4>{serviceDisplayer(order.service_id)}</h4>
                    {order.prov && <h4>{order.prov_des}</h4>}
                    <hr color='#666666' className='hr-details'/>
                    <h3>Solicitante: </h3>
                    <h4>{order.requester}</h4>
                    <h4>{order.email}</h4>
                    <hr color='#666666' className='hr-details'/>
                    <h3>Estado del Pedido: </h3>
                    <h4>{order.state}</h4>
                    <hr color='#666666' className='hr-details'/>
                    {order.legajo ?
                      <div>
                        <h3>Entregar a legajo: {order.legajo}</h3>
                        <hr color='#666666' className='hr-details'/>
                      </div>
                      :
                      ''
                    }
                    <h3>Fecha:</h3>
                    <h4>{'Ordenado: '+dbDateParser(order.date_requested, false)}</h4>
                    <h4>{order.date_aproved ? 'Aprobado: '+dbDateParser(order.date_aproved, false) : 'Aprobacion: pendiente'}</h4>
                    <h4>{order.date_delivered ? "Recibido: "+dbDateParser(order.date_delivered,false) : 'Entrega: pendiente'}</h4>
                    <hr color='#666666' className='hr-details'/>
                    {checkToAdd() &&
                        <div className='data-div-add-special'>
                            <h4>Agregar insumo: </h4>
                            <input type="checkbox" checked={addIns} onChange={(e) => setAddIns(e.target.checked)}/>
                        </div>
                    }
                    {global?.user.rol === 4 &&
                      <div className='data-div-add-special'>
                          <h4>{order.legajo ?"Modificar entrega a Personal":"Entrega a Personal:"} </h4>
                          <input type="checkbox" checked={showLegajo} onChange={(e) => setShowLegajo(e.target.checked)}/>
                      </div>}
                    {displayLegajo()}

                    {addIns &&
                        <div>
                        <select defaultValue={''} value={newIns} className="data-div-select"
                        onChange={e => setNewAdd(e.target.value)}>
                        <option value={''}>---</option>
                        {
                            global?.insumos.map((i, index) => (
                                <option key={index} value={i}>{i}</option>
                            ))
                        }
                        </select>
                        <input type="number" step='any' id='amount' min={0}
                        value={newAmount} onChange={(e) => setNewAmount(parseFloat(e.target.value))}
                        className="data-div-textfield-amount"/>
                        <button className='btn-export-pdf' onClick={() => addNewInsumo()}>Agregar</button>
                        </div>
                    }
                    <table >
                        <tbody>
                            <tr>
                                <th>Insumo</th>
                                <th>Cantidad</th>
                            </tr>
                            {order.insumos.map((i, index) => (
                                <tr key={i.insumo_id} className={classChange()}>
                                    <th className='data-div-insumo-name-row' onClick={() => deleteInsumoRow(index, i.insumo_des, i.detail_id)}>{i.insumo_des}</th>
                                    <th className='data-div-insumo-amount-row' onClick={() => changeAmount(i.amount, i.detail_id)}>{i.amount}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        else{
            return(<h3 className='title-Homepage'>Cargando...</h3>)
        }
    }
/*
const provBtn = () => {
    if(order?.prov && global?.user.rol === 1){
        return(<button className='btn-export-pdf' onClick={() => navigator('/provisorio/'+order?.numero)}>Provisorio</button>)
    }
}
*/


    return(
        <div className='detaail-all-div'>
            <div className='div-header-pedidos'>
                <Header />
            </div>
            <h1 className='title-Homepage' >
                {'Pedido: '+global?.pedidoDetail.numero}
            </h1>
            <hr color='#3399ff' className='hr-line'/>
            {dataDisplay()}
            {commentText()}
            {btnDisplay()}

        </div>
    )
}
