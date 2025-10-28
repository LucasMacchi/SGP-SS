import { IDesglosesReturner, IEnvioInsumos, IPlanComplete, IrequestEnvioCom } from "./Interfaces";



export default function ( desgloses: IDesglosesReturner[],insumos: IEnvioInsumos[], plan: IPlanComplete[]): IrequestEnvioCom[]{
    let envios: IrequestEnvioCom[] = []
    desgloses.sort((a,b) => a.lentrega_id - b.lentrega_id)
    desgloses.forEach((linea) => {
        let envio: IrequestEnvioCom = {
            entregaId: 0,
            desglose: "",
            detalles: [],
            cue: 0,
            fortificado: false,
            dias: 0
        }
        if(linea.des && linea.lentrega_id && (linea.fortificado ? linea.rac_al : linea.rac_cl)) {
        plan.forEach((p1) => {
            const raciones = linea.fortificado ? (linea.rac_al ? linea.rac_al * p1.dias : 0) : (linea.rac_cl ? linea.rac_cl * p1.dias : 0)
            if(p1.plan_id === linea.planId) {
            p1.details.forEach((p) => {
                insumos.forEach(ins => {
                    if(ins.ins_id === p.ins_id) {
                        if(ins.unidades_caja > 0) {
                            const value: number = raciones / 30 * p.dias
                            const unidades = Math.ceil(value / ins.racbolsa)
                            const cajas = value >= ins.unidades_caja ?  Math.floor(value / ins.raccaja) : 0
                            const racxcajas = value - ins.raccaja * cajas
                            const bolsas = Math.ceil(racxcajas / ins.racbolsa)
                            const kilos = unidades * ins.gr_total / 1000
                            envio.detalles.push({
                                kilos: kilos,
                                cajas: cajas,
                                bolsas: bolsas,
                                raciones: Math.floor(bolsas * ins.racbolsa + cajas * ins.raccaja),
                                unidades: Math.floor(bolsas + cajas * ins.unidades_caja),
                                unit_caja: ins.unidades_caja,
                                caja_palet: ins.caja_palet,
                                des: ins.des
                            })
                        }
                        else {
                            const value: number = raciones / 30 * p.dias
                            const unidades = Math.ceil(value / ins.racbolsa)
                            const cajas = 0
                            const bolsas = Math.ceil(value / ins.racbolsa)
                            const kilos = unidades * ins.gr_total / 1000
                            envio.detalles.push({
                                kilos: kilos,
                                cajas: cajas,
                                bolsas: bolsas,
                                raciones: Math.floor(bolsas * ins.racbolsa + cajas * ins.raccaja),
                                unidades: Math.floor(bolsas + cajas * ins.unidades_caja),
                                unit_caja: 0,
                                caja_palet: ins.caja_palet,
                                des: ins.des
                            })
                            
                        }
                    }
                });
            })
            envio.dias = p1.dias
            }
        
        })
            envio.desglose = linea.des
            envio.entregaId = linea.lentrega_id
            envio.cue = parseInt(linea.cue)
            envio.fortificado = linea.fortificado
            envios.push(envio)
        }
        else console.log("DATO NO VALIDO ",linea)
        
    })
    return envios
}