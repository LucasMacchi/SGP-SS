import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import {useEffect, useContext, useState } from "react";
import { GlobalContext } from "../../Context/GlobalContext";
import "./Compras.css"
import { rolesNum } from "../../Utils/Interfaces";
import ComprasDocument from "../pdfs/compras";
import { pdf } from "@react-pdf/renderer";
import saveAs from "file-saver";

export default function CompraDetail () {

    const params = useParams()
    const id = params.id
    const global = useContext(GlobalContext)
    const [comentarios, setComentarios] = useState("")

    useEffect(() => {
        if(global) {if(global.login === false) global?.sessionFn()}
        if(id && global) {
            global.getUniqCompra(parseInt(id))
        }
    },[])

    const changeEstado = async (aprobar: boolean) => {
        const msg = aprobar ? "Quieres aprobar esta compra?" : "Quieres rechazar esta compra?"
        if(comentarios.length > 24) {
            if(confirm(msg)){
                if(aprobar) {
                    global?.changeStateCompra(aprobar, global.compraDetail.compra_id, comentarios)
                }
                else{
                    global?.changeStateCompra(aprobar, global.compraDetail.compra_id,comentarios)
                }
            }
        } else alert("Comentario con un minimo de 25 caracteres es necesario.")

    }

    const actionEditDes = (id: number) => {
        if((global?.user.rol === rolesNum.admin || global?.user.rol === rolesNum.administrativo) && !global.compraDetail.anulado
            && !global.compraDetail.aprobado) {
            const newDes = prompt("Ingrese la nueva descripcion: ")
            if(newDes) {
                global.editDesProdCompra(id,newDes)
            }
        }
    }

    const actionEditCant = (id: number) => {
        if((global?.user.rol === rolesNum.admin || global?.user.rol === rolesNum.administrativo) && !global.compraDetail.anulado
            && !global.compraDetail.aprobado) {
            const newDes = prompt("Ingrese la nueva cantidad: ")
            if(newDes && parseInt(newDes)) {
                global.editCantProdCompra(id,parseInt(newDes))
            }
        }
    }

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
                                <th className="table-interaction" style={{border: "1px solid"}}
                                onClick={() => actionEditDes(c.detail_id ? c.detail_id : 0)}>{c.descripcion}</th>
                                <th className="table-interaction" style={{border: "1px solid"}}
                                onClick={() => actionEditCant(c.detail_id ? c.detail_id : 0)}>{c.cantidad}</th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    const downloadPdf = async () => {
        if(global && global.compraDetail) {
            const blob: Blob = 
            await pdf(<ComprasDocument c={global?.compraDetail}/>).toBlob()
            saveAs(blob, 'TEST.pdf')
        }

    }
    const displayStatus = () => {
        if(global?.compraDetail.aprobado || global?.compraDetail.anulado){

            if(global?.compraDetail.aprobado){
            return(
                <div className='data-div-info' style={{backgroundColor: "#32CD32",color: "white"}}>
                    <div className='data-div-info'>
                        <h4>Comentarios:</h4>
                        <textarea value={global?.compraDetail.comentario} className='texarea-details'
                        disabled/>
                    </div>
                    <h4>Estado: APROBADO</h4>
                    <button className='btn-export-pdf' onClick={() => downloadPdf()}>Descargar Planilla</button>
                </div>
            )
            }
            else if(global?.compraDetail.anulado){
            return(
                <div className='data-div-info' style={{backgroundColor: "#FF0000", color: "white"}}>
                    <div className='data-div-info'>
                        <h4>Comentarios:</h4>
                        <textarea value={global?.compraDetail.comentario} className='texarea-details'
                        disabled/>
                    </div>
                    <h4>Estado: RECHAZADO</h4>
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
        else if(global?.user.rol === rolesNum.admin || global?.user.rol === rolesNum.administrativo) {
            return(
                <div>
                    <div className='data-div-info'>
                        <h4>Comentarios:</h4>
                        <h6>Comentario con un minimo de 25 caracteres es necesario</h6>
                        <h6>Actuales {comentarios.length}</h6>
                        <textarea value={comentarios} className='texarea-details'
                        onChange={(e) => setComentarios(e.target.value)}/>
                    </div>
                    <div className='div-btns'>
                        <button className='btn-accept' onClick={() => changeEstado(true)}>APROBAR</button>
                        <button className='btn-negative' onClick={() => changeEstado(false)}>RECHAZAR</button>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className='data-div-info'>
                    <h4>Estado: PENDIENTE</h4>
                </div>
            )

        }
    }


    return(
        <div>
            <Header />
            <div>
                <div className='data-div-info'>
                    <h4>ID: {global?.compraDetail.nro}</h4>
                </div>
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
                    <h4>Insumos o Servicios a comprar:</h4>
                </div>
                {displayInsumos()}
                <div className='data-div-info'>
                    <h4>Descripcion:</h4>
                    <textarea value={global?.compraDetail.descripcion} className='texarea-details'
                    disabled/>
                </div>
                {displayStatus()}
            </div>
        </div>
    )
}