export default function (amount: number, value: number): string {
    let formatted = ""+value
    if(value.toString().length < amount) {
        const diff = amount - formatted.length
        for (let index = 1; index <= diff; index++) {
            formatted = "0"+formatted
        }
    }
    return formatted
}