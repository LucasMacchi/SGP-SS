import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IDataEntregaPdf } from '../../Utils/Interfaces';

const stylePedido = StyleSheet.create({
    logo: {
        width: 90
    },
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
        padding: 2,
        paddingLeft: 40
    },
    view_title: {
        display: 'flex',
        paddingLeft: 40
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderRightWidth: 0,
        borderBottomWidth: 0,
      },
      tableRow: {
        flexDirection: 'row',
      },
      tableRow_header: {
        flexDirection: 'row',
        backgroundColor: '#65b1fc'
      },
      tableColIns: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderTopWidth: 0,
      },
      tableColID: {
        width: '10%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderTopWidth: 0,
      },
      tableCell: {
        margin: 5,
        fontSize: 8,
        textAlign: 'left',
      },
      viewdata: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'flex-start',
        paddingLeft: 40
      },
      viewdataHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'space-between',
        
      },
      viewdataReq: {
        marginLeft: 20
      }
})

const DataDocumentEntrega: React.FC<IDataEntregaPdf> = (data) => (
    <Document>
        <Page size={'A4'} style={stylePedido.page}>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                </View>
                <View >
                    <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                    <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata}>
                <View >
                    <Text style={stylePedido.title}>Datos Solicitado - {data.solicitado}</Text>
                    <Text style={stylePedido.body}>Cantidad encontrados: {data.datos.length}</Text>
                    <Text style={stylePedido.body}>Descripcion:</Text>
                    <Text style={stylePedido.body}>{data.descripcion}</Text>
                </View>
            </View>

            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>ID</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Lugares de Entrega</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Localidad</Text>
                    </View>
                </View>
                </View>
                {data.datos.map((i) => (
                    <View style={stylePedido.tableRow}>
                        <View style={stylePedido.tableColID}>
                            <Text style={stylePedido.tableCell}>{i.lentrega_id}</Text>
                        </View>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCell}>{i.completo}</Text>
                        </View>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCell}>{i.localidad}</Text>
                        </View>
                    </View>
                ))}
                
            </View>
        </Page>
    </Document>
)

export default DataDocumentEntrega
