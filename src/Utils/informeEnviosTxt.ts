
export default function (txtLines: string[]) {
    let cabecera = ""
    txtLines.forEach(l => cabecera += l+"\r\n");

    const blob = new Blob([cabecera], { type: 'text/plain;charset=utf-8' })
    const dateNow = dateParser(new Date())
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'INFORME-TANDA-'+dateNow+".txt";
    link.click();
    URL.revokeObjectURL(url);
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