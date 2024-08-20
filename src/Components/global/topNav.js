import {StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StyledText } from './styledComponents';
import { hs, vs, ms } from './responsiveScaling';

export default function TopNav({hasBackArrow = false, title = ""}){
    const navigation = useNavigation()
    return(
        <>
        {hasBackArrow ?     
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size = {ms(30)} color ={"#232020"} />
            </TouchableWithoutFeedback>
            <View style={styles.nav_title}>
                <StyledText large color="#232020">{title}</StyledText>
            </View>
        </View>:

        <View style={styles.container}>
        <View><StyledText large color= "#F57600">Run It</StyledText></View>

        <View style= {styles.iconContainer}>
            <Ionicons name="notifications" size= {ms(30)} color ={"#232020"} />
            <Ionicons name="person-circle" size= {ms(30)} color ={"#232020"} />
        </View>
        </View>}
        </>)
}

const styles = StyleSheet.create({
    container:{
        height: vs(90),
        backgroundColor: "#686D76",
        flexDirection:"row",
        justifyContent: "space-between",
        alignItems:"flex-end",
        paddingHorizontal: hs(10),
        paddingVertical: vs(10)
    },

    iconContainer:{
        flexDirection: "row",
        gap: hs(20)
    },
    nav_title:{
        marginLeft: "auto",
        marginRight: "auto",
        paddingRight: hs(10)
    }
    
})