import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ICollectionPDF } from '../../Utils/Interfaces';

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
      tableColcod: {
        width: '8%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderTopWidth: 0,
      },
      tableColCant: {
        width: '7%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderLeftWidth: 0,
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

const CollectionDocument: React.FC<ICollectionPDF> = ({collection}) => (
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
            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Pedido</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Servicio</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Solicitante</Text>
                    </View>
                </View>
                </View>
                {collection.orders.map((i) => (
                    <View style={stylePedido.tableRow}>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCell}>{i.numero}</Text>
                        </View>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCell}>{i.service_des}</Text>
                        </View>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCell}>{i.requester}</Text>
                        </View>
                    </View>
                ))}
                
            </View>

            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>cod</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>cod 1</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>cod 2</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>cod 3</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Insumo</Text>
                    </View>
                    <View style={stylePedido.tableColCant}>
                        <Text style={stylePedido.tableCell}>Cant</Text>
                    </View>
                </View>
                </View>
                {collection.insumos.map((i) => (
                    <View style={stylePedido.tableRow}>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.insumo_id}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.ins_cod1 === 0 ? ' ' : i.ins_cod1}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.ins_cod2 === 0 ? ' ' : i.ins_cod2}</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCell}>{i.ins_cod3 === 0 ? ' ' : i.ins_cod3}</Text>
                        </View>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCell}>{i.insumo_des}</Text>
                        </View>
                        <View style={stylePedido.tableColCant}>
                            <Text style={stylePedido.tableCell}>{i.sum}</Text>
                        </View>
                    </View>
                ))}
                
            </View>
        </Page>
    </Document>
)

export default CollectionDocument
