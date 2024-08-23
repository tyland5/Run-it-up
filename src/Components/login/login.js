import React, { useState } from 'react';
import {Keyboard,StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from './authContext';
import { useNavigation } from '@react-navigation/native';
import { hs, vs, ms } from '../global/responsiveScaling';
import { StyledText, StyledTextInput, StyledButton } from '../global/styledComponents';

const envVariables = require('../../../envVariables.json');

export default function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [credentialErr, setCredentialErr] = useState(false)
    const {loggedIn, setLoggedIn} = useContext(AuthContext)
    const navigation = useNavigation()

    const checkCredentials = () => {

        
        fetch(envVariables.serverURL +"/login/checkCredentials", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
               Accept : "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.response === "good"){
                setCredentialErr(false)
                setLoggedIn(true)
            }
            else{
                setCredentialErr(true)
            }
        })
        // could render a loading screen here
    }

    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            
            <View style={styles.title}>
                <StyledText xlarge >Run It Up</StyledText>
            </View>

            <View style={styles.inputs}>
                <StyledTextInput placeholder='Username' placeholderTextColor="gray" value={username} onChangeText={(user) => setUsername(user.toLowerCase())}></StyledTextInput>
                <StyledTextInput secureTextEntry = {true} placeholder='Password' placeholderTextColor="gray" value ={password} onChangeText={(pw) => setPassword(pw)}></StyledTextInput>
            </View>
            
            <StyledButton large onPress={checkCredentials}>
                <StyledText bold>Sign In</StyledText>
            </StyledButton>

            {credentialErr ? <StyledText error>Incorrect username or password</StyledText> : <></>}
            <View style={{marginBottom: vs(40)}}></View>
            
            <StyledText>New User?{' '}
                <TouchableWithoutFeedback onPress={()=>navigation.navigate("Register")}><StyledText underline>Register</StyledText></TouchableWithoutFeedback>
            </StyledText>
            <View style={{marginBottom: vs(20)}}></View>
            <TouchableWithoutFeedback onPress={()=>navigation.navigate("ForgotPassword")}><StyledText underline>Forgot Password</StyledText></TouchableWithoutFeedback>
        </View>
    </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        alignItems:'center'
    },
    title:{
        marginTop: "30%",
        marginBottom: vs(80)
    },
    inputs:{
        width: "100%",
        gap: vs(20),
        marginBottom: vs(30),
        alignItems: "center"
    },
    
})