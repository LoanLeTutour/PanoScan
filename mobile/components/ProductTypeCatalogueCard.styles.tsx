import { StyleSheet} from "react-native";

import { Colors } from "@/constants/Colors";

const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        minWidth: '50%',
        gap: 3,
        borderRadius: 10,
        elevation: 5,
    },
    textButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white
    },
    container: {
        width: '100%',
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding:15,
        elevation: 10,
        shadowColor: Colors.secondary,   
    },
    overview:{
        flexDirection:'row',
        borderRadius: 10,
        backgroundColor: Colors.secondary,
    },
    imageContainer:{
        width: '45%',
        height: '100%',
        borderRadius: 10,
    },
    image:{
        width: 140,
        height:200,
        borderRadius: 10,
    },
    imageInfo:{
        width: 140,
        height:80,
        borderRadius: 10,
        marginTop: 10
    },
    infoContainer:{
        width: '55%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    idemContainer: {
        alignItems: 'center',
        gap : 5
    },
    text:{
        color: Colors.white,
        fontWeight: 'bold',
    },
    loadingSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
      },
      modalContainer:{
        flex: 1,
        backgroundColor: Colors.secondary,
        opacity: 1
    },
    modalView:{
        
    },
    heading: {
        alignSelf: 'center',
        marginBottom: 20,
        width: 250,
        alignItems: 'center',
    },
    closeModalButton: {
        alignSelf: 'flex-start',
        margin: 10
    },
    modalTitle: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 25,
    },
    modalSubtitle: {
        color: Colors.white,
        fontSize: 15,
    },
    modalTextFormat:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        width: 40,
        flexWrap: 'wrap',
    },
    modalTextThicknesses:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 15,
        width: 36,
        textAlign: 'center',
    },
    content: {
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
    },
    headingContent:{
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: 60,
        gap: 30,

    },
    dataContent: {
        flexDirection: 'column',
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotContainer: {
        flexDirection: 'row',
        marginLeft: 24,
        gap: 54,
    },
})

export default styles