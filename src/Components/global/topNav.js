import {StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function TopNav({hasBackArrow = false}){
    navigation = useNavigation()
    return(
        <>
        {hasBackArrow ?     
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size = {30} color ={"#232020"} />
            </TouchableWithoutFeedback>
        </View>:

        <View style={styles.container}>
        <View><Text style={styles.logo}>Run It</Text></View>

        <View style= {styles.iconContainer}>
            <Ionicons name="notifications" size= {30} color ={"#232020"} />
            <Ionicons name="person-circle" size= {30} color ={"#232020"} />
        </View>
        </View>}
        </>)
}

const styles = StyleSheet.create({
    container:{
        height: 90,
        backgroundColor: "#686D76",
        flexDirection:"row",
        justifyContent: "space-between",
        alignItems:"flex-end",
        padding: 10
    },
    logo:{
        color: "#F57600", 
        fontSize: 28
    },
    iconContainer:{
        flexDirection: "row",
        gap: 20
    }
    
})