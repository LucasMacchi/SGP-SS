import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logoG from '../../assets/logo_big.png'
import { ICompraDocu,IinsumoCompra } from '../../Utils/Interfaces';
const stylePedido = StyleSheet.create({
    logo: {
        width: 90,
        paddingLeft: 10

    },
    page: {
        padding: 10,
        fontFamily: 'Helvetica',
    },
    globalView: {
      borderWidth: 1
    },
    headerView: {
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1
    },
    title: {
        fontSize: 13,
    },
    subtitle_header: {
        fontSize: 10,
        fontWeight: 'heavy',
        textAlign: 'center'
    },
    body_header: {
        fontSize: 8,
        paddingRight: 10,
        fontWeight: 'heavy',
        textAlign: 'center'
    },
    viewSec0: {
      borderBottomWidth: 1,
      padding: 5,
      backgroundColor: '#65b1fc'
    },
    viewSec1: {
      flexDirection: "row"
    },
    viewSec2: {
        flexDirection: "row"
    },
    subtitle: {
        fontSize: 12
    },
    subtitle_Heavy: {
        fontSize: 12,
        fontWeight: 'heavy',
    },
    body: {
      fontSize: 10
    },
    table: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: 'row',
      borderTopWidth: 1,
    },
    tableColcod: {
      width: '20.6%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderTopWidth: 0,
    },
    tableColSmall: {
      width: '11.666%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderTopWidth: 0,
    },
    tableColBg: {
      width: '30%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderTopWidth: 0,
    },
    tableColHeader: {
      width: '150px',
      borderStyle: 'solid',
      borderWidth: 1,
      borderTopWidth: 1,
      
    },
    tableTxt: {
      fontSize: 10,
      marginLeft: "2px"
    },
    tableTxtInsumos: {
      fontSize: 9,
      marginLeft: "1px"
    },
    tableHeader: {
        marginBottom: "10px",
        marginTop: "10px",
        marginRight: "15px"
    },
    tableRowHeader: {
      flexDirection: 'row'
    }

})


const tableElementsReturner = (compras: IinsumoCompra[], lugar: string) => {
  const min = compras.length > 25 ? compras.length - 1 : 40
  const elements = []
  for (let i = 0; i < min; i++){
    elements.push(
      <View style={stylePedido.tableRow}>
        <View style={stylePedido.tableColBg}>
            <Text style={stylePedido.tableTxtInsumos}>{compras[i] ? compras[i].descripcion : " "}</Text>
        </View>
        <View style={stylePedido.tableColSmall}>
            <Text style={stylePedido.tableTxtInsumos}></Text>
        </View>
        <View style={stylePedido.tableColSmall}>
            <Text style={stylePedido.tableTxtInsumos}>{compras[i] ? compras[i].cantidad : " " }</Text>
        </View>
        <View style={stylePedido.tableColSmall}>
            <Text style={stylePedido.tableTxtInsumos}>{compras[i] ? lugar : " " }</Text>
        </View>
        <View style={stylePedido.tableColSmall}>
            <Text style={stylePedido.tableTxtInsumos}></Text>
        </View>
        <View style={stylePedido.tableColSmall}>
            <Text style={stylePedido.tableTxtInsumos}></Text>
        </View>
        <View style={stylePedido.tableColSmall}>
            <Text style={stylePedido.tableTxtInsumos}></Text>
        </View>
      </View>
    )
  }
  return elements
}

const ComprasDocument: React.FC<ICompraDocu> = ({c}) => (
    <Document>
        <Page size={'A4'} style={stylePedido.page} orientation="portrait">
          <View style={stylePedido.globalView}>
            <View style={stylePedido.headerView}>
              <Image style={stylePedido.logo} source={'logoss'} src={logoG}/>
              <View>
                <Text style={stylePedido.subtitle_header}>SOLICITUD DE COMPRA DE INSUMOS PARA SERVICIOS</Text>
              </View>
              <View>
                <Text style={stylePedido.body_header}>REG-SER-008</Text>
                <Text style={stylePedido.body_header}>Pagina 1 de 1</Text>
                <Text style={stylePedido.body_header}>03/24</Text>
                <Text style={stylePedido.body_header}>Version 00</Text>
              </View>
            </View>
            <View style={stylePedido.viewSec0}></View>
            <View style={stylePedido.viewSec2}>
                <View style={stylePedido.tableHeader}>
                    <View style={stylePedido.tableRowHeader}>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>Nº de Solicitud</Text>
                        </View>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>{c.nro}</Text>
                        </View>
                    </View>
                    <View style={stylePedido.tableRowHeader}>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>Fecha de Solicitud</Text>
                        </View>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>{c.fecha.split("T")[0]}</Text>
                        </View>
                    </View>
                </View>
                <View style={stylePedido.tableHeader}>
                    <View style={stylePedido.tableRowHeader}>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>Solicitante</Text>
                        </View>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>{c.fullname}</Text>
                        </View>
                    </View>
                    <View style={stylePedido.tableRowHeader}>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>Area</Text>
                        </View>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>{c.area}</Text>
                        </View>
                    </View>
                </View>
                <View style={stylePedido.tableHeader}>
                    <View style={stylePedido.tableRowHeader}>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>Proveedor</Text>
                        </View>
                        <View style={stylePedido.tableColHeader}>
                            <Text style={stylePedido.tableTxt}>{c.proveedor}</Text>
                        </View>
                    </View>
                </View>
                <View/>
            </View>
            <View style={stylePedido.viewSec2}>
                <View style={stylePedido.table}>
                    <View style={stylePedido.tableRow}>
                        <View style={stylePedido.tableColBg}>
                            <Text style={stylePedido.tableTxtInsumos}>Des. del insumo</Text>
                        </View>
                        <View style={stylePedido.tableColSmall}>
                            <Text style={stylePedido.tableTxtInsumos}>Cant. Existencia</Text>
                        </View>
                        <View style={stylePedido.tableColSmall}>
                            <Text style={stylePedido.tableTxtInsumos}>Cant. Solicitida</Text>
                        </View>
                        <View style={stylePedido.tableColSmall}>
                            <Text style={stylePedido.tableTxtInsumos}>Lugar de Entrega</Text>
                        </View>
                        <View style={stylePedido.tableColSmall}>
                            <Text style={stylePedido.tableTxtInsumos}>Solicitar ficha tecnica y de seguridad</Text>
                        </View>
                        <View style={stylePedido.tableColSmall}>
                            <Text style={stylePedido.tableTxtInsumos}>Compra realizada (cant)</Text>
                        </View>
                        <View style={stylePedido.tableColSmall}>
                            <Text style={stylePedido.tableTxtInsumos}>Fecha recepcion</Text>
                        </View>
                    </View>
                    {tableElementsReturner(c.compras, c.lugar)}
                </View>
            </View>
          </View>
        </Page>
    </Document>
)

export default ComprasDocument
