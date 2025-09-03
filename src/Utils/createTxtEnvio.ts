import JSZip from "jszip";
import { ITxtEnvios } from "./Interfaces";

export default function (txtLines: ITxtEnvios, tanda: number) {
    const zip = new JSZip();
    let cabecera = ""
    let items = ""
    txtLines.cabecera.forEach(l => cabecera += l+"\n");
    txtLines.items.forEach(l => items += l+"\n");


    zip.file('VCABECER.txt',cabecera)
    zip.file('VITEMS.txt',items)

    const dateNow = dateParser(new Date())

    zip.generateAsync({type: 'blob'}).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = dateNow+'-exportacion-envio-tanda'+tanda+".zip";
        link.click();
        URL.revokeObjectURL(url);
    })
}

function dateParser (tDate: Date): string {
    const day = tDate.getUTCDate()
    let dayStr = day.toString()
    const month = tDate.getUTCMonth() + 1
    let mStr = month.toString()
    const year = tDate.getUTCFullYear()
    if(day < 10) dayStr = "0"+dayStr
    if(month < 10) mStr = "0"+mStr
    return year+mStr+dayStr
}