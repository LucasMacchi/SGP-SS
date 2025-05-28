
export default function (dbdate: string, rDate: boolean) : string | Date {
    const date = dbdate.split('T')
    const dateParsed = date[0].split('-')
    const dateD = new Date(parseInt(dateParsed[0]), parseInt(dateParsed[1]), parseInt(dateParsed[2]))
    return rDate ? dateD : dateParsed[2] + '/' + dateParsed[1] + '/' + dateParsed[0]

}
