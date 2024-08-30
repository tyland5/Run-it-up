import React, { useEffect, useState } from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, ScrollView} from 'react-native';
import { hs, vs, ms } from '../global/responsiveScaling';
import { StyledText, StyledTextLabel, StyledTextInput, StyledButton } from '../global/styledComponents';
import { useNavigation } from '@react-navigation/native';

const envVariables = require('../../../envVariables.json');

// we are putting the email confirmation code in route param only to enforce a seamless register process
export default function EmailConfirm({route}){

    const [confCode, setConfCode] = useState('')
    const {generatedCode, accountDetails} = route.params
    const [showErr, setShowErr] = useState(false)
    const navigation = useNavigation()

    useEffect(()=>{
        console.log(generatedCode)
        console.log(accountDetails)
    }, [])

    async function handleConfirm(){
        if(confCode === generatedCode){
            const res = await fetch(envVariables.serverURL + "/login/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                   Accept : "application/json",
                },
                body: JSON.stringify({
                    accountDetails: accountDetails
                }),
            });
    
            const jsonRes = await res.json();
            if(jsonRes.response === "good"){
                navigation.navigate("Login")
            }
        }
        else{
            setShowErr(true)
        }
    }

    return(
    <View style={styles.container}>
        <View style={{height:vs(30)}}></View>
        <StyledTextLabel>We've sent you an email with a confirmation code. Please enter it</StyledTextLabel> 
        <StyledTextInput placeholder='Confirmation Code' placeholderTextColor="gray" value ={confCode} onChangeText={(code) => setConfCode(code)}></StyledTextInput>
        {showErr ? <StyledTextLabel error>Code entered does not match</StyledTextLabel> : <></>}
        <View style={{height:vs(15)}}></View>

        <StyledButton large onPress={handleConfirm}>
            <StyledText bold>Submit</StyledText>
        </StyledButton>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        alignItems:'center'
    },
})