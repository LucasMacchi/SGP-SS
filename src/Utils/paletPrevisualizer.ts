import { IDesglosesReturner, IEnvioInsumos, IPlanComplete } from "./Interfaces";


export default function paletPrevisualizer 
(lugares: IDesglosesReturner[], planes: IPlanComplete[], insumos: IEnvioInsumos[]) {
    let totalPalets = 0
    let totalRac = 0
    let planDias = 0
    const lugaresCL = lugares.filter(lg => lg.fortificado).sort((a,b) => a.lentrega_id - b.lentrega_id)
    const lugaresAL = lugares.filter(lg => !lg.fortificado).sort((a,b) => a.lentrega_id - b.lentrega_id)
    //const lugaresFinal = lugaresCL.concat(lugaresAL)
    let auxId = 0
    let totalRemitos = 0
    if(lugaresCL.length) {
        lugaresCL.forEach((lg) => {
            if(lg.lentrega_id !== auxId){
                auxId = lg.lentrega_id
                totalRemitos++
            }
        });
    }
    auxId = 0
    if(lugaresAL.length) {
        lugaresAL.forEach((lg) => {
            if(lg.lentrega_id !== auxId){
                auxId = lg.lentrega_id
                totalRemitos++
            }
        });
    }

    
    if(planes) {
        lugares.forEach(lg => {
            const rac = lg.fortificado ? lg.rac_al : lg.rac_cl
            if(rac){
                planes.forEach((p) => {
                    if(lg.planId && lg.planId === p.plan_id){
                        planDias = p.dias
                        p.details.forEach(p => {
                            const racxdays = rac * p.dias
                            insumos.forEach(ins => {
                                if(ins.ins_id === p.ins_id) {
                                    const racxpalet = ins.unidades_caja > 0 ? ins.raccaja * ins.caja_palet : ins.racbolsa * ins.caja_palet
                                    totalPalets += Math.floor(racxdays / racxpalet)
                                }
                            })
                        })
                    }
                    
                })
                totalRac += rac * planDias
            }
        })
    }

    return {palets: totalPalets, racs: totalRac, totalRemitos: totalRemitos}
}