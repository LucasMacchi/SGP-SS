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
            totalRacCL += lg.rac_cl ? lg.rac_cl : 0
        });

    }
    auxId = 0
    if(lugaresAL.length) {
        lugaresAL.forEach((lg) => {
            if(lg.lentrega_id !== auxId){
                auxId = lg.lentrega_id
                totalRemitos++
            }
            totalRacAL += lg.rac_al ? lg.rac_al : 0
        });
    }

    if(planes) {
        if(lugaresCL.length > 0 && lugaresCL[0].planId) {
            let plan = planes[0]
            planes.map((cl) => {
                if(cl.plan_id === lugaresCL[0].planId) plan = cl
            })
            totalRacCL = totalRacCL * plan.dias
            plan.details.forEach((d) => {
                insumos.forEach((ins) => {
                    if(ins.ins_id === d.ins_id) {
                        const racxplanxins = totalRacCL / plan.dias * d.dias
                        const racxpalet = ins.raccaja ? ins.raccaja * ins.caja_palet : ins.racbolsa * ins.caja_palet
                        const palet = Math.floor(racxplanxins / racxpalet)
                        console.log(ins.des)
                        console.log(racxplanxins, racxpalet, palet)
                        totalPalets += palet
                    }
                })
            })
        }
        if(lugaresAL.length > 0 && lugaresAL[0].planId) {
            let plan = planes[0]
            planes.map((cl) => {
                if(cl.plan_id === lugaresAL[0].planId) plan = cl
            })
            totalRacAL = totalRacAL * plan.dias
            plan.details.forEach((d) => {
                insumos.forEach((ins) => {
                    if(ins.ins_id === d.ins_id) {
                        const racxplanxins = totalRacAL / plan.dias * d.dias
                        const racxpalet = ins.raccaja ? ins.raccaja * ins.caja_palet : ins.racbolsa * ins.caja_palet
                        const palet = Math.floor(racxplanxins / racxpalet)
                        console.log(ins.des)
                        console.log(racxplanxins, racxpalet, palet)
                        totalPalets += palet
                    }
                })
            })
        }
    }

    return {palets: totalPalets, racs: totalRacAL+totalRacCL, totalRemitos: totalRemitos}
}