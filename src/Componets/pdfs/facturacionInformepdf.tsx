
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import {IFacturacionDataInforme, IFacturacionDataInformePDF } from '../../Utils/Interfaces';
import logoBig from "../../assets/logo_big.png"
import { ToWords } from 'to-words';
const stylePedido = StyleSheet.create({
    logo: {
        width: 120,
        alignItems: "center"
    },
    page: {
        fontFamily: 'Helvetica',
        padding: 14
    },
    title: {
        fontSize: 16,
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 9
    },
    view: {
        padding: 2,
        paddingLeft: 5
    },
    view_title: {
        display: 'flex',
        paddingLeft: 40
    },
    table: {
        width: 'auto',
        borderBottomWidth: 1,
        borderTopWidth: 1,
      },
      tableRow: {
        flexDirection: 'row',
      },
      tableRow_header: {
        flexDirection: 'row',
      },
      tableColIns: {
        width: '50%',
      },
      tableColIns2: {
        width: '50%',
        borderStyle: "solid",
        borderRightWidth: 1,
        borderColor: "black"
      },
      tableColcod: {
        width: '16%',
      },
      tableColcod2: {
        width: '18%',
        borderStyle: "solid",
        borderRightWidth: 1,
        borderColor: "black"
      },
      tableColCant2: {
        width: '7%',
        borderStyle: "solid",
        borderRightWidth: 1,
        borderColor: "black"
      },
      tableColCant: {
        width: '7%',
      },
      tableCell: {
        margin: 3,
        fontSize: 9,
        textAlign: 'center',
      },
      tableCell2: {
        margin: 3,
        fontSize: 9,
        textAlign: 'right',
      },
        tableCellH: {
        margin: 2,
        fontSize: 10,
        textAlign: 'left',
        fontWeight: 900
      },
      viewdata: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: "space-between",
        paddingLeft: 5
      },
      viewdataFooter: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: "space-between",
        paddingLeft: 5,
        marginTop: 58
      },
      viewdataHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'space-between',
      },
      viewLastData: {
        padding: 2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      viewdataReq: {
        marginLeft: 20
      }
})


const insumosDisplayer = (remitos: IFacturacionDataInforme[],count: number,last:boolean,totalAmount: number,totalRac: number,totalRts: number) => {
    const elements = []
    const amount = remitos.length > count ? remitos.length : count
    for (let i = 0; i < amount; i++) {
        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{remitos[i] ? "RT R "+remitos[i].remito : " "}</Text>
                </View>
                <View style={stylePedido.tableColIns2}>
                    <Text style={stylePedido.tableCell}>{remitos[i] ? remitos[i].cabecera : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell2}>{remitos[i] ? remitos[i].raciones : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell2}>{remitos[i] ? Intl.NumberFormat("es-AR",{style: "currency", currency: "ARS"}).format(remitos[i].amount) : " "}</Text>
                </View>
            </View>
        )
    
    }
    if(last) {
    const wordsParser = new ToWords({
        localeCode: "es-AR",
        converterOptions: {
            ignoreDecimal: false,
            currency: true
        }
    })
    const wordsParserRac = new ToWords({
        localeCode: "es-AR",
        converterOptions: {
            ignoreDecimal: false,
            currency: false
        }
    })
    elements.push(
        <View style={stylePedido.tableRow}>
            <View style={stylePedido.tableColcod2}>
                <Text style={stylePedido.tableCell}>{"Totales"}</Text>
            </View>
            <View style={stylePedido.tableColIns2}>
                <Text style={stylePedido.tableCell}>{"Remitos: "+totalRts}</Text>
            </View>
            <View style={stylePedido.tableColcod2}>
                <Text style={stylePedido.tableCell2}>{totalRac}</Text>
            </View>
            <View style={stylePedido.tableColcod2}>
                <Text style={stylePedido.tableCell2}>{Intl.NumberFormat("es-AR",{style: "currency", currency: "ARS"}).format(totalAmount)}</Text>
            </View>
        </View>
    )

    elements.push(
        <View style={stylePedido.viewdataHeader}>
            <View >
                <Text style={stylePedido.subtitle}>Son raciones: {wordsParserRac.convert(totalRac) + " Raciones"}</Text>
                <Text style={stylePedido.subtitle}>Son pesos: {wordsParser.convert(totalAmount)}</Text>
            </View>
        </View>
    )
    }
    return elements
}


const informeFacturacionPDF: React.FC<IFacturacionDataInformePDF> = ({data,title,fecha}) => {
    let racionesTotal = 0
    let amountTotal = 0
    data.forEach(d => {
        racionesTotal += d.raciones
        amountTotal += d.amount
    });
    const paginasCount = 38
    const pages: IFacturacionDataInforme[][] = []
    for (let i = 0; i < data.length; i += paginasCount) {
      const arr = data.slice(i,i + paginasCount)
      pages.push(arr)
    }
    return (
        <Document>
            <Page size={'A4'} style={stylePedido.page}>
                <View style={{flexDirection: 'row', justifyContent: "center"}}>
                    <Image src={logoBig} style={stylePedido.logo}/>
                </View>
                <View style={stylePedido.viewdataHeader}>
                    <View >
                        <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                        <Text style={stylePedido.subtitle}>Fecha: {fecha.split("T")[0]}</Text>
                    </View>
                    <View >
                        <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                        <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                        <Text style={stylePedido.subtitle}>Codigo Postal 3400</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: "center"}}>
                    <Text style={stylePedido.title}>{title}</Text>
                </View>
                <View style={stylePedido.view}>
                    <View style={stylePedido.table}>
                    <View style={stylePedido.tableRow_header}>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCellH}>REMITO</Text>
                        </View>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCellH}>CABECERA</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCellH}>RACIONES</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCellH}>FACTURADO</Text>
                        </View>
                    </View>
                    </View>
                </View>
                {insumosDisplayer(pages[0],paginasCount,false,amountTotal,racionesTotal,data.length)}
            </Page>
            {pages.map((d,i) => {
                const isLast = i === pages.length - 1
                if(i !== 0) {
                    return (
                        <Page size={'A4'} style={stylePedido.page}>
                            {insumosDisplayer(d,paginasCount,isLast,amountTotal,racionesTotal,data.length)}
                        </Page>
                    )
                }
            })}
        </Document>
    )
}

export default informeFacturacionPDF

/*
                if(i === 0) {
                    return (
                        {insumosDisplayer(d,paginasCount,false)}
                    )
                }
                else if (i === pages.length) {
                    return (
                        <Page size={'A4'} style={stylePedido.page}>
                            {insumosDisplayer(d,paginasCount,false)}
                        </Page>
                    )
                }
                else {
                    return (
                        <Page size={'A4'} style={stylePedido.page}>
                            {insumosDisplayer(d,paginasCount,false)}
                        </Page>
                    )
                }
*/