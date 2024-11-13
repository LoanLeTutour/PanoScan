import { StyleSheet} from "react-native";

import { Colors } from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()

const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        minWidth: '50%',
        gap: verticalScale(3),
        borderRadius: verticalScale(10),
        elevation: verticalScale(5),
    },
    textButton: {
        fontSize: verticalScale(20),
        fontWeight: 'bold',
        color: Colors.white
    },
    container: {
        width: '100%',
        backgroundColor: Colors.secondary,
        borderRadius: verticalScale(10),
        padding: verticalScale(15),
        elevation: verticalScale(5),
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowColor: Colors.secondary,    
    },
    overview:{
        flexDirection:'row',
        borderRadius: verticalScale(10),
        backgroundColor: Colors.secondary,
    },
    imageContainer:{
        width: '45%',
        height: '100%',
        borderRadius: verticalScale(10),
    },
    image:{
        width: horizontalScale(140),
        height: verticalScale(200),
        borderRadius: horizontalScale(10),
    },
    imageInfo:{
        width: horizontalScale(140),
        height: verticalScale(80),
        borderRadius: verticalScale(10),
        marginTop: verticalScale(10)
    },
    infoContainer:{
        width: '55%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    idemContainer: {
        alignItems: 'center',
        gap : verticalScale(5)
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
        marginBottom: verticalScale(20),
        width: horizontalScale(250),
        alignItems: 'center',
    },
    closeModalButton: {
        alignSelf: 'flex-start',
        margin: verticalScale(10)
    },
    modalTitle: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(25),
    },
    modalSubtitle: {
        color: Colors.white,
        fontSize: verticalScale(15),
    },
    modalTextFormat:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(14),
        textAlign: 'center',
        width: horizontalScale(42),
    },
    modalTextThicknesses:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(14),
        width: horizontalScale(36),
        textAlign: 'center',
    },
    content: {
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        padding: verticalScale(20),
    },
    headingContent:{
        flexDirection: 'row',
        marginBottom: verticalScale(20),
        marginLeft: horizontalScale(60),
        gap: horizontalScale(27),

    },
    dataContent: {
        flexDirection: 'column',
        gap: horizontalScale(20),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotContainer: {
        flexDirection: 'row',
        marginLeft: horizontalScale(26),
        gap: horizontalScale(53),
    },
})

export default styles