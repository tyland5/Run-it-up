import React, { useState } from 'react';
import {Keyboard,StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from './authContext';
import { useNavigation } from '@react-navigation/native';

const envVariables = require('../../../envVariables.json');

export default function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [credentialErr, setCredentialErr] = useState(false)
    const [loggedIn, setLoggedIn] = useContext(AuthContext)
    const navigation = useNavigation()

    const checkCredentials = () => {
        /*
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
            console.log(data)
            if(data.response === "good"){
                setCredentialErr(false)
                setLoggedIn(true)
            }
            else{
                setCredentialErr(true)
            }
        })
        */
        setLoggedIn(true)
        // could render a loading screen here
    }

    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            
            <Text style={styles.title}>Run It Up</Text>
            <TextInput style={styles.input} placeholder='Username' placeholderTextColor="gray" value={username} onChangeText={(user) => setUsername(user.toLowerCase())}></TextInput>
            <TextInput secureTextEntry = {true} style={styles.input} placeholder='Password' placeholderTextColor="gray" value ={password} onChangeText={(pw) => setPassword(pw)}></TextInput>

            <TouchableOpacity style={styles.button} onPress={checkCredentials}>
                <Text style={styles.button_text}>Sign In</Text>
            </TouchableOpacity>
            {credentialErr ? <Text style={[styles.error, {marginTop:20}]}>Incorrect username or password</Text> : <></>}
            <View style={{marginBottom:50}}></View>
            
            <Text style={styles.text}>New User?{' '}
                <TouchableWithoutFeedback onPress={()=>navigation.navigate("Register")}><Text style={[styles.text, {textDecorationLine: 'underline'}]}>Register</Text></TouchableWithoutFeedback>
            </Text>
            <View style={{marginBottom:20}}></View>
            <TouchableWithoutFeedback onPress={()=>navigation.navigate("ForgotPassword")}><Text style={[styles.text, {textDecorationLine: 'underline'}]}>Forgot Password</Text></TouchableWithoutFeedback>
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
        fontSize: 40,
        color:"white",
        marginBottom: 80
    },
    text:{
        fontSize:16,
        color:"white"
    },
    error:{
        fontSize:16,
        color:"red"
    },
    input:{
        width:"80%",
        color:"white",
        padding:10,
        fontSize:16,
        borderWidth:2,
        borderColor:"white",
        borderRadius: 8,
        marginBottom: 30
    },
    button:{
        width:150,
        height: 70,
        backgroundColor:"#F57600",
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 8,
    },
    button_text:{
        color:"white",
        fontSize:18,
        fontWeight:"bold"
    }
    
})