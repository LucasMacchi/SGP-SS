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
        plan.details.forEach((p) => {
            insumos.forEach(ins => {
                if(ins.ins_id === p.ins_id) {
                    const value: number = linea.raciones / 30 * p.dias
                    const unidades = Math.ceil(value / (ins.gr_total / ins.gr_racion))
                    const cajas = Math.floor(unidades / ins.unidades_caja)
                    const bolsas = Math.ceil(unidades - (cajas * ins.unidades_caja))
                    const kilos = unidades * ins.gr_total / 1000
                    envio.detalles.push({
                        kilos: kilos,
                        cajas: cajas,
                        bolsas: bolsas,
                        raciones: Math.floor(unidades * (ins.gr_total / ins.gr_racion)),
                        unidades: unidades,
                        unit_caja: ins.unidades_caja,
                        caja_palet: ins.caja_palet,
                        des: ins.des
                    })
                }
            });
        })

        envio.desglose = linea.dependencia
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
                data.push(excelP)
            });
            resolve(data)
        };
        reader.readAsArrayBuffer(excel)
    })

}