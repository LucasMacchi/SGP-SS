
export default function () {
    const currentDate = new Date()
    const month = currentDate.getMonth()
    const date = currentDate.getDate()
    const year = currentDate.getFullYear()
    if(month === 0){
        const newM = 11
        const newY = year - 1
        return newY+(newM < 10 ? '-0' : '-')+newM+'-'+date
    }
    else {
        const newM = month - 1
        return year+(newM < 10 ? '-0' : '-')+newM+'-'+date
    }
}