import {StyleSheet, Text, View, Button } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StyledText } from './styledComponents';
import { hs, vs, ms } from './responsiveScaling';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../login/authContext';

const envVariables = require('../../../envVariables.json');

export default function TopNav({hasBackArrow = false, title = "", hasSettings = false}){
    const navigation = useNavigation()
    const {selfUid} = useContext(AuthContext) 
    const [pfp, setPfp] = useState('')

    // TODO: I dont like that we fetch pfp everytime we reach home. need to somehow detect that we came from profile
    // Not terrible rendering wise thanks to expo-image

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            if((title === "")){
                //setImageKey(Date.now())
                getPfp()
            }
          });
      
        return unsubscribe;
    },[])

    async function getPfp(){
        const resp = await fetch(envVariables.serverURL + "/user/getUserPfp")
        const respJson = await resp.json()
        setPfp(respJson.res[0].pfp)
    }

    return(
        <>
        {hasBackArrow ?     
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size = {ms(30)} color ={"white"} />
            </TouchableWithoutFeedback>
            
            <View style={styles.nav_title}>
                <StyledText large color="white">{title}</StyledText>
            </View>

            {hasSettings &&
            <TouchableWithoutFeedback onPress={() => navigation.push("Settings")}>
                <Ionicons style={{ right:hs(10)}} name="settings" size = {ms(30)} color ={"white"} />
            </TouchableWithoutFeedback>}

        </View>:

        <View style={styles.container}>
        <View><StyledText large color= "#F57600">Run It</StyledText></View>

        <View style= {styles.iconContainer}>
            <Ionicons name="notifications" size= {ms(30)} color ={"white"} />
            <TouchableWithoutFeedback onPress={() => navigation.navigate("Profile", {uid:selfUid})}>
                {pfp && <Image style={{width:ms(30), height: ms(30), borderRadius:ms(30)}} source={{uri:pfp}} onLoad={() => console.log("rendered pfp nav bar")}></Image>}
            </TouchableWithoutFeedback>
        </View>
        </View>}
        </>)
}

const styles = StyleSheet.create({
    container:{
        height: vs(90),
        backgroundColor: "#121212",
        flexDirection:"row",
        justifyContent: "space-between",
        alignItems:"flex-end",
        paddingHorizontal: hs(10),
        paddingVertical: vs(5),
        borderBottomWidth: ms(1),
        borderColor: "gray"
    },

    iconContainer:{
        flexDirection: "row",
        gap: hs(15),
        marginRight: hs(5)
    },
    nav_title:{
        marginLeft: "auto",
        marginRight: "auto",
    }
    
})