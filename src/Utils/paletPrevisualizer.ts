import { IDesglosesReturner, IEnvioInsumos, IPlanComplete } from "./Interfaces";


export default function paletPrevisualizer 
(lugares: IDesglosesReturner[], planes: IPlanComplete[], insumos: IEnvioInsumos[]) {
    let totalPalets = 0
    let totalRacCL = 0
    let totalRacAL = 0
    const lugaresCL = lugares.filter(lg => !lg.fortificado).sort((a,b) => a.lentrega_id - b.lentrega_id)
    const lugaresAL = lugares.filter(lg => lg.fortificado).sort((a,b) => a.lentrega_id - b.lentrega_id)
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
        if(lugaresCL.length > 0) {
            lugaresCL.forEach(cl => {
                planes.forEach(pln => {
                    if(pln.plan_id === cl.planId && cl.rac_cl) {
                        const racionesxplan = cl.rac_cl * pln.dias
                        totalRacCL += racionesxplan
                        pln.details.forEach((pld) => {
                            insumos.forEach((ins) => {
                                if(ins.ins_id === pld.ins_id) {
                                    const racxplanxins = totalRacCL / pln.dias * pld.dias
                                    const racxpalet = ins.raccaja ? ins.raccaja * ins.caja_palet : ins.racbolsa * ins.caja_palet
                                    const palet = Math.floor(racxplanxins / racxpalet)
                                    totalPalets += palet
                                }
                            })
                        })
                    }
                });
            });
        }
        if(lugaresAL.length > 0) {
            lugaresAL.forEach(al => {
                planes.forEach(pln => {
                    if(pln.plan_id === al.planId && al.rac_cl) {
                        const racionesxplan = al.rac_cl * pln.dias
                        totalRacAL += racionesxplan
                        pln.details.forEach((pld) => {
                            insumos.forEach((ins) => {
                                if(ins.ins_id === pld.ins_id) {
                                    const racxplanxins = totalRacAL / pln.dias * pld.dias
                                    const racxpalet = ins.raccaja ? ins.raccaja * ins.caja_palet : ins.racbolsa * ins.caja_palet
                                    const palet = Math.floor(racxplanxins / racxpalet)
                                    totalPalets += palet
                                }
                            })
                        })
                    }
                });
            });
        }
    }

    return {palets: totalPalets, racs: totalRacAL+totalRacCL, totalRemitos: totalRemitos}
}