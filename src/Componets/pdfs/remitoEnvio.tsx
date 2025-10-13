
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import {IRemitoEnvio, IRemitoEnvioDetails, IRemitosPrintData } from '../../Utils/Interfaces';
import logoBig from "../../assets/logo_big.png"

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
        width: '100%',
      },
      tableColIns2: {
        width: '100%',
        borderStyle: "solid",
        borderRightWidth: 1,
        borderColor: "black"
      },
      tableColcod: {
        width: '18%',
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
        margin: 2,
        fontSize: 11,
        textAlign: 'left',
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

const dateReturner = () => {
    const current = new Date()
    const date = current.getDate()
    const mes = current.getMonth() + 1
    const year = current.getFullYear()
    return date + "/"+mes+"/"+year
}


const insumosDisplayer = (insumos: IRemitoEnvioDetails[]) => {
    const elements = []
    const amount = insumos.length > 24 ? insumos.length : 24
    let undT = 0
    let kgT = 0
    let cajasT = 0
    let bolsT = 0
    let racT = 0
    for (let i = 0; i < amount; i++) {
        const ins = insumos[i]
        undT += ins ? ins.total_unidades : 0
        kgT += ins ? ins.total_kilos : 0
        cajasT += ins ? ins.total_cajas : 0
        bolsT += ins ? ins.total_bolsas : 0
        racT += ins ? ins.total_raciones : 0
        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColIns2}>
                    <Text style={stylePedido.tableCell}>{ins ? ins.descripcion.toUpperCase() : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{ins ? ins.total_unidades : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{ins ? ins.total_kilos : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{ins ? ins.total_cajas : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{ins ? ins.total_bolsas : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{ins ? ins.total_raciones : " "}</Text>
                </View>
            </View>
        )
    
    }
        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColIns2}>
                    <Text style={stylePedido.tableCell}>Total</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{undT}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{kgT.toFixed(2)}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{cajasT}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{bolsT}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{racT}</Text>
                </View>
            </View>
        )
        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>Total de Desgloses: 20</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
            </View>
        )
        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>Raciones por 30 dias habiles</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
            </View>
        )
    return elements
}

const pageContruct = (e: IRemitoEnvio, copia: boolean) => (
        <Page size={'A4'} style={stylePedido.page}>
            <View style={{flexDirection: 'row', justifyContent: "center"}}>
                <Image src={logoBig} style={stylePedido.logo}/>
            </View>
            <View style={{flexDirection: 'row', justifyContent: "center"}}>
                <Text style={stylePedido.subtitle}>[ R ]</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: "center"}}>
                <Text style={stylePedido.subtitle}>DOCUMENTO NO VALIDO COMO FACTURA</Text>
            </View>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                </View>
                <View >
                    <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                    <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                    <Text style={stylePedido.subtitle}>Codigo Postal 3400</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata}>
                <View >
                    <Text style={stylePedido.body}>Telefono: 3794-586633</Text>
                    <Text style={stylePedido.body}>Correo: info@solucionesyservicios.com.ar</Text>
                    <Text style={stylePedido.body}>IVA: Responsable Inscripto</Text>
                    <Text style={stylePedido.body}>Ing. Brutos: 905-302000-1</Text>
                </View>
                <View >
                    <Text style={stylePedido.body}>Remito {e.nro_remito}</Text>
                    <Text style={stylePedido.body}>Fecha: {dateReturner()}</Text>
                    <Text style={stylePedido.body}>CUIT: 30-71609306-5</Text>
                    <Text style={stylePedido.body}>Inicio Actividades: 01/12/2021</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata}>
                <View >
                    <Text style={stylePedido.body}>MINISTERIO DE EDUCACION DE CORRIENTES</Text>
                    <Text style={stylePedido.body}>LA RIOJA 663</Text>
                    <Text style={stylePedido.body}>3400 - CORRIENTES</Text>
                    <Text style={stylePedido.body}>IVA: Exento</Text>
                </View>
                <View >
                    <Text style={stylePedido.body}>Cliente: 000001</Text>
                    <Text style={stylePedido.body}>CUIT: 30-70731824-0</Text>
                </View>
            </View>
            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCellH}>Insumo</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCellH}>Unid.</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCellH}>Kg / lts</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCellH}>Pack</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCellH}>Bolsas</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCellH}>Raciones</Text>
                    </View>
                </View>
                </View>
                {insumosDisplayer(e.detalles)}
            </View>
            <View style={stylePedido.viewdata}>
                <Text style={stylePedido.body}>Lugar de Entrega: {e.le_des}</Text>
                <Text style={stylePedido.body}>Localidad: {e.le_localidad}</Text>
                <Text style={stylePedido.body}>Direccion: {e.le_direccion}</Text>
            </View>
            <View style={stylePedido.viewdataFooter}>
                <Text style={stylePedido.body}>Sello institucion</Text>
                <Text style={stylePedido.body}>Conformidad (firma)</Text>
                <Text style={stylePedido.body}>Aclaracion Cargo Dni</Text>
                <Text style={stylePedido.body}>Fecha Recepcion</Text>
            </View>
            <View style={stylePedido.viewLastData}>
                <View><Text style={stylePedido.body}>Fecha Vto.: {e.fcha_venc}</Text></View>
            </View>
            <View style={stylePedido.viewLastData}>
                <View><Text style={stylePedido.body}>C.A.I N°: {e.cai}</Text></View>
            </View>
            <View style={stylePedido.viewLastData}>
                <View><Text style={stylePedido.body}>{copia ? "Copia" : "Original"}</Text></View>
            </View>
        </Page>

)


const RemitoEnvioPdf: React.FC<IRemitosPrintData> = ({envios}) => (
    <Document>
        {envios.flatMap((e) => [
            pageContruct(e,false),
            pageContruct(e,true)
        ])}

    </Document>
)

export default RemitoEnvioPdf
