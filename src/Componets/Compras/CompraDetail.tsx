import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import {useEffect, useContext } from "react";
import { GlobalContext } from "../../Context/GlobalContext";

export default function CompraDetail () {

    const params = useParams()
    const id = params.id
    const global = useContext(GlobalContext)

    useEffect(() => {
        if(global) {if(global.login === false) global?.sessionFn()}
        if(id && global) {
            global.getUniqCompra(parseInt(id))
        }
    },[])

    const displayInsumos = () => {
        if(global && global.compraDetail && global.compraDetail.compras && global.compraDetail.compras.length > 0) {
            return(
                <div>
                    <table style={{fontSize: "small", width: "100%"}}>
                        <tbody>
                            <tr>
                                <th style={{border: "1px solid", width: "92%"}}>Descripcion</th>
                                <th style={{border: "1px solid", width: "8%"}}>Cant</th>
                            </tr>
                            {global?.compraDetail.compras.map((c,i) => (
                            <tr key={i}>
                                <th style={{border: "1px solid"}}>{c.descripcion}</th>
                                <th style={{border: "1px solid"}}>{c.cantidad}</th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    const displayStatus = () => {
        if(global?.compraDetail.aprobado || global?.compraDetail.anulado){

                        if(global?.compraDetail.aprobado){
            return(
                <div className='data-div-info'>
                    <h4>Estado: APROBADO</h4>
                </div>
            )
            }
            else if(global?.compraDetail.anulado){
            return(
                <div className='data-div-info'>
                    <h4>Estado: ANULADO</h4>
                </div>
            )
            }
            else {
            return(
                <div className='data-div-info'>
                    <h4>Estado: PENDIENTE</h4>
                </div>
            )
            }

        }
        else{
            return(
                <div>
                    <div className='div-btns'>
                        <button className='btn-accept' onClick={() => console.log("Aprobar")}>APROBAR</button>
                        <button className='btn-negative' onClick={() => console.log("Anulado")}>RECHAZAR</button>
                    </div>
                </div>
            )

        }
    }


    return(
        <div>
            <Header />
            <div>
                <div className='data-div-info'>
                    <h4>Solicitante: {global?.compraDetail.fullname}</h4>
                </div>
                <div className='data-div-info'>
                    <h4>Fecha: {global?.compraDetail.fecha.split("T")[0]}</h4>
                </div>
                <div className='data-div-info'>
                    <h4>Area: {global?.compraDetail.area}</h4>
                </div>
                <div className='data-div-info'>
                    <h4>Tipo: {global?.compraDetail.tipo}</h4>
                </div>
                <div className='data-div-info'>
                    <h4>Lugar: {global?.compraDetail.lugar}</h4>
                </div>
                <div className='data-div-info'>
                    <h4>Proveedor: {global?.compraDetail.proveedor}</h4>
                </div>
                <div className='data-div-info'>
                    <h4>Proveedor: {global?.compraDetail.proveedor}</h4>
                </div>
                <div className='data-div-info'>
                    <h4>Insumos o Servicios a comprar:</h4>
                </div>
                {displayInsumos()}
                {displayStatus()}
            </div>
        </div>
    )
}