export default function (lineas: string[]) {
    let cabecera = ""
    lineas.forEach(l => cabecera += l+"\r\n");

    const blob = new Blob([cabecera], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SMovim01.txt';
    link.click();
    URL.revokeObjectURL(url);
}