
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const stylePedido = StyleSheet.create({
    logo: {
        width: 35,
    },
    page: {
        fontFamily: 'Helvetica',
        padding: 14
    },
    title: {
        fontSize: 24,
        fontWeight:900,
        marginLeft:50,
        marginBottom: 5
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
        fontSize: 10,
        textAlign: 'center',
      },
      tableCell2: {
        margin: 2,
        fontSize: 10,
        textAlign: 'left',
      },
        tableCellH: {
        margin: 2,
        fontSize: 10,
        textAlign: 'left',
        fontWeight: 900
      },
      viewdata: {
        flexDirection: 'column',
        borderBottomWidth: 1,
        padding: 4,
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
      },
    titleActa: {
        fontSize: 16,
        fontWeight: 800
    },
    subtitleActa: {
        fontSize: 16,
        margin: 5
    },
    subtitleActaData: {
        fontSize: 18,
        fontWeight: 800,
        textDecoration: "underline"
    },
    viewData: {
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 15,
        textAlign: "justify"
    },
})


const PDFFumigacionesFm = () => (
    <Document>
            <Page size={'A4'} style={stylePedido.page}>
            <View style={{...stylePedido.viewdataHeader,justifyContent:"flex-start",borderBottomWidth: 1}}>
                <Image src={"/fumigadoraLogo.jpg"} style={stylePedido.logo}/>
                <Text style={stylePedido.title}>FUMIGADORA DEL LITORAL</Text>
            </View>
            <View style={{flexDirection: "column",justifyContent:"center",textAlign:"center",marginTop: 5,marginBottom:5}}>
                <Text style={{...stylePedido.subtitle,textDecoration: "underline",fontWeight: 800}}>HAB. MUNIC Nº: 051/20  - SALUD PUB. NAC. Nº: 127 -  SENASA Nº: T. 1022.-</Text>
                <Text style={stylePedido.subtitle}>DESINFECCIÓN - DESINSECTACIÓN - DESRATIZACIÓN - CONTROL DE MURCIÉLAGOS </Text>
                <Text style={stylePedido.subtitle}>LIMPIEZA Y DESINFECCIÓN DE CISTERNAS  Y TANQUES DE AGUA</Text>
            </View>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.subtitle}>2 de Abril 3300 - CORRIENTES</Text>
                    <Text style={stylePedido.subtitle}>Tel.: 3795765130</Text>
                </View>
                <View>
                    <Text style={stylePedido.subtitle}>fumigadoradellitorall@gmail.com</Text>
                </View>
            </View>
            <View style={{...stylePedido.view,textAlign:"center"}}>
                <Text style={stylePedido.titleActa}>AVISO DE FUMIGACION</Text>  
            </View>
            <View style={stylePedido.view}>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>El Dia .............. , ........../........../.......... a partir de las  ........ h. Se realizará</Text>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>FUMIGACION EN LOS ESPACIOS COMUNES</Text>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>Se recomienda transitar lo menos posible entre las .......... y las .......... hs.</Text>
            </View>
            <Text style={stylePedido.subtitleActa}>..............................................................................................................................</Text>
            <View style={{...stylePedido.viewdataHeader,justifyContent:"flex-start",borderBottomWidth: 1}}>
                <Image src={"/fumigadoraLogo.jpg"} style={stylePedido.logo}/>
                <Text style={stylePedido.title}>FUMIGADORA DEL LITORAL</Text>
            </View>
            <View style={{flexDirection: "column",justifyContent:"center",textAlign:"center",marginTop: 5,marginBottom:5}}>
                <Text style={{...stylePedido.subtitle,textDecoration: "underline",fontWeight: 800}}>HAB. MUNIC Nº: 051/20  - SALUD PUB. NAC. Nº: 127 -  SENASA Nº: T. 1022.-</Text>
                <Text style={stylePedido.subtitle}>DESINFECCIÓN - DESINSECTACIÓN - DESRATIZACIÓN - CONTROL DE MURCIÉLAGOS </Text>
                <Text style={stylePedido.subtitle}>LIMPIEZA Y DESINFECCIÓN DE CISTERNAS  Y TANQUES DE AGUA</Text>
            </View>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.subtitle}>2 de Abril 3300 - CORRIENTES</Text>
                    <Text style={stylePedido.subtitle}>Tel.: 3795765130</Text>
                </View>
                <View>
                    <Text style={stylePedido.subtitle}>fumigadoradellitorall@gmail.com</Text>
                </View>
            </View>
            <View style={{...stylePedido.view,textAlign:"center"}}>
                <Text style={stylePedido.titleActa}>AVISO DE FUMIGACION</Text>  
            </View>
            <View style={stylePedido.view}>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>El Dia .............. , ........../........../.......... a partir de las  ........ h. Se realizará</Text>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>FUMIGACION EN LOS ESPACIOS COMUNES</Text>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>Se recomienda transitar lo menos posible entre las .......... y las .......... hs.</Text>
            </View>
            <Text style={stylePedido.subtitleActa}>..............................................................................................................................</Text>
            <View style={{...stylePedido.viewdataHeader,justifyContent:"flex-start",borderBottomWidth: 1}}>
                <Image src={"/fumigadoraLogo.jpg"} style={stylePedido.logo}/>
                <Text style={stylePedido.title}>FUMIGADORA DEL LITORAL</Text>
            </View>
            <View style={{flexDirection: "column",justifyContent:"center",textAlign:"center",marginTop: 5,marginBottom:5}}>
                <Text style={{...stylePedido.subtitle,textDecoration: "underline",fontWeight: 800}}>HAB. MUNIC Nº: 051/20  - SALUD PUB. NAC. Nº: 127 -  SENASA Nº: T. 1022.-</Text>
                <Text style={stylePedido.subtitle}>DESINFECCIÓN - DESINSECTACIÓN - DESRATIZACIÓN - CONTROL DE MURCIÉLAGOS </Text>
                <Text style={stylePedido.subtitle}>LIMPIEZA Y DESINFECCIÓN DE CISTERNAS  Y TANQUES DE AGUA</Text>
            </View>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.subtitle}>2 de Abril 3300 - CORRIENTES</Text>
                    <Text style={stylePedido.subtitle}>Tel.: 3795765130</Text>
                </View>
                <View>
                    <Text style={stylePedido.subtitle}>fumigadoradellitorall@gmail.com</Text>
                </View>
            </View>
            <View style={{...stylePedido.view,textAlign:"center"}}>
                <Text style={stylePedido.titleActa}>AVISO DE FUMIGACION</Text>  
            </View>
            <View style={stylePedido.view}>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>El Dia .............. , ........../........../.......... a partir de las  ........ h. Se realizará</Text>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>FUMIGACION EN LOS ESPACIOS COMUNES</Text>
                <Text style={{...stylePedido.subtitleActa,fontWeight:400}}>Se recomienda transitar lo menos posible entre las .......... y las .......... hs.</Text>
            </View>
            <Text style={stylePedido.subtitleActa}>..............................................................................................................................</Text>
        </Page>
    </Document>
)

export default PDFFumigacionesFm