import * as XLSX from 'xlsx';
import { IEnvioInsumos, IPlanComplete, IrequestEnvioCom } from './Interfaces';



interface excelLineas {
    lentrega: number,
    dependencia: string,
    raciones: number
}

export default async function ExcelParserEnvios (excel: File, insumos: IEnvioInsumos[], plan: IPlanComplete): Promise<IrequestEnvioCom[][]>{
    const data = await parsedReturned(excel)
    let envios: IrequestEnvioCom[][] = []
    data.forEach(hoja => {
        const hojaData: IrequestEnvioCom[] = []
    hoja.forEach((linea) => {
        let envio: IrequestEnvioCom = {
            entregaId: 0,
            desglose: "",
            detalles: [],
        }
        const parsedDependencia = linea.dependencia.replace('"',"").replace("'","")
        if(linea.dependencia && linea.lentrega && linea.raciones) {
        plan.details.forEach((p) => {
            insumos.forEach(ins => {
                if(ins.ins_id === p.ins_id) {
                    if(ins.unidades_caja > 0) {
                        const value: number = linea.raciones / 30 * p.dias
                        const unidades = Math.ceil(value / ins.racbolsa)
                        const cajas = Math.floor(value / ins.raccaja)
                        const bolsas = Math.ceil((value - cajas * ins.raccaja) / ins.racbolsa)
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
                        const value: number = linea.raciones / 30 * p.dias
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
        }
        else console.log("DATO NO VALIDO ",linea)


        envio.desglose = parsedDependencia
        envio.entregaId = linea.lentrega
        hojaData.push(envio)
    })
        envios.push(hojaData)
    });

    return envios
}


async function parsedReturned (excel: File): Promise<excelLineas[][]> {
    return new Promise((resolve, reject) =>{
        const reader = new FileReader()
        let data: excelLineas[][] = []
        reader.onerror = () => reject("Error")
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const binaryStr = event.target?.result;
            const workbook = XLSX.read(binaryStr, { type: 'array' });
            const sheets = workbook.SheetNames
            sheets.forEach(sheet => {
                const currentSh = workbook.Sheets[sheet]
                const excelP: excelLineas[] = XLSX.utils.sheet_to_json(currentSh)
                excelP.sort((a,b) => a.lentrega - b.lentrega)
                data.push(excelP)
            });
            resolve(data)
        };
        reader.readAsArrayBuffer(excel)
    })

}