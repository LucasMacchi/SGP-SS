
export default function (dbdate: string, rDate: boolean) : string | Date {
    const date = dbdate.split('T')
    const dateParsed = new Date(date[0])
    const year = dateParsed.getFullYear()
    const month = dateParsed.getMonth() + 1
    const day = dateParsed.getDate() + 1
    return rDate ? dateParsed : day + '/' + month + '/' + year

}