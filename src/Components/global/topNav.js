import {StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TopNav(){
    return(
        <View style={styles.container}>
            <View><Text style={styles.logo}>Run It</Text></View>
           
            <View style= {styles.iconContainer}>
                <Ionicons name="notifications" size= {30} color ={"white"} />
                <Ionicons name="person-circle" size= {30} color ={"white"} />
            </View>
        </View>)
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