import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { JSX } from 'react/jsx-runtime';
import { IInsumo, IOrderRemito } from '../../Utils/Interfaces';

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
        marginTop: "75px"    
    },
    viewFecha: {
        marginLeft: "450px",
        marginTop: "80px",
        flexDirection: "row"
    },
    viewTitulo: {
        marginTop: "48px",
        marginLeft: "60px",
    },
    viewLocal: {
        marginTop: "28px",
        marginLeft: "360px",
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
        marginBottom: 6,
        fontSize: 10,
        textAlign: 'left',
        fontWeight: "900"
    },
    dateText: {
        fontSize: 10,
        marginRight: "27px",
        fontWeight: "bold"
    }
})

interface IRemitoData {
    c: IOrderRemito[]
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

const divisionByPageCollection = (data:IOrderRemito[]):JSX.Element[] => {
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
                <View style={stylePedido.viewTitulo}>
                    <Text style={stylePedido.dateText}>{arr.client_des+" - "+arr.service_des+ " - "+(arr.numero ? arr.numero : "")}</Text>
                </View>
                <View style={stylePedido.viewLocal}>
                    <Text style={stylePedido.dateText}>{arr.localidad}</Text>
                </View>
                <View style={stylePedido.view}>
                    <View style={stylePedido.table}>
                        {uniqTable(arr.insumos)}
                    </View>             
                </View>
            </Page>
        )

    });
    return elementsArr
}

const RemitoDocumentCol: React.FC<IRemitoData> = (data) => (
    <Document>
        {divisionByPageCollection(data.c)}
    </Document>
)

export default RemitoDocumentCol