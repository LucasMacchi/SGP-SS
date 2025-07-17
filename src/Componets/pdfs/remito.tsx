import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { JSX } from 'react/jsx-runtime';
import { IInsumo } from '../../Utils/Interfaces';

const stylePedido = StyleSheet.create({
    page: {
        padding: 10,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 13,
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 8
    },
    view: {
        marginLeft: "30px",
        marginTop: "170px"
    },
    viewFecha: {
        marginLeft: "450px",
        marginTop: "92px",
        flexDirection: "row"
    },
    table: {
        width: 'auto',
    },
    tableRow: {
        flexDirection: 'row',
    },
      tableColSmall: {
        width: '10%',
    },
    tableColBig: {
        width: '67%',
    },
    tableColMd: {
        width: '12%',
    },
    tableCell: {
        marginBottom: 8.5,
        fontSize: 8,
        textAlign: 'left',
        fontWeight: "bold"
    },
    dateText: {
        fontSize: 10,
        marginRight: "27px",
        fontWeight: "bold"
    }
})

export interface IExample {
    des: string,
    cant: number,
    punitario: number
}

interface IRemitoData {
    c: IInsumo[][]
}

const uniqTable = (arr2: IInsumo[]): JSX.Element[] => {
    const newArr: JSX.Element[] = []
    arr2.forEach((e) => {
        newArr.push(
                <View style={stylePedido.tableRow}>
                    <View style={stylePedido.tableColSmall}>
                        <Text style={stylePedido.tableCell}>{e.amount}</Text>
                    </View>
                    <View style={stylePedido.tableColBig}>
                        <Text style={stylePedido.tableCell}>{e.insumo_des}</Text>
                    </View>
                    <View style={stylePedido.tableColMd}>
                        <Text style={stylePedido.tableCell}></Text>
                    </View>
                    <View style={stylePedido.tableColMd}>
                        <Text style={stylePedido.tableCell}></Text>
                    </View>
                </View>
        )
    });
    return newArr
}

export const divisionTable = (data: IInsumo[]): IInsumo[][] => {
    const newArray = []
    for(let i = 0; i < data.length; i += 23) {
        newArray.push(data.slice(i, i+23))
    }
    return newArray
}

const divisionByPage = (data:IInsumo[][]):JSX.Element[] => {
    const elementsArr: JSX.Element[] = []
    const date = new Date()
    data.forEach(arr => {
        elementsArr.push(
            <Page size={'A4'} style={stylePedido.page}>
                <View style={stylePedido.viewFecha}>
                    <Text style={stylePedido.dateText}>{date.getDate()}</Text>
                    <Text style={stylePedido.dateText}>{date.getMonth()+1}</Text>
                    <Text style={stylePedido.dateText}>{date.getFullYear()}</Text>
                </View>
                <View style={stylePedido.view}>
                    <View style={stylePedido.table}>
                        {uniqTable(arr)}
                    </View>             
                </View>
            </Page>
        )

    });
    return elementsArr
}

const RemitoDocument: React.FC<IRemitoData> = (data) => (
    <Document>
        {divisionByPage(data.c)}
    </Document>
)

export default RemitoDocument