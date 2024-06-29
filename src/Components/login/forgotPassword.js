import React, { useEffect, useState } from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, ScrollView} from 'react-native';
import { useContext } from 'react';
import { AuthContext } from './authContext';
import { useNavigation } from '@react-navigation/native';

const envVariables = require('../../../envVariables.json');

// we are putting the email confirmation code in route param only to enforce a seamless register process
export default function ForgotPassword({route}){

    const [formData, setFormData] = useState({
        email:'',
        password:'',
        confirmPassword: '',
        confirmCode:''
    })

    const [generatedCode, setGeneratedCode] = useState('')
    const [emailSelected, setEmailSelected] = useState(false)
    const navigation = useNavigation()

    const [showErr, setShowErr] = useState({
        confirmCode: false,
        email: false,
        password: false,
        confirmPassword: false
    })
 
    async function setEmail(){
        // first check if an account with this email exists
        const res = await fetch(envVariables.serverURL + "/login/checkEmail?" + new URLSearchParams({email:formData.email}));
        const resJson = await res.json();

        if(resJson.response === "bad" || !resJson.validEmail){
            setShowErr({...showErr, email: true})
            return
        }
        setShowErr({...showErr, email: false})
        // if email is valid, get confirmation code and show change pass inputs
        const res2 = await fetch(envVariables.serverURL + "/login/confirmEmail?" + new URLSearchParams({email:formData.email}));
        const resJson2 = await res2.json();

        setGeneratedCode(resJson2.confCode);
        setEmailSelected(true);        
    }

    async function handleConfirm(){
        const errs = {
            confirmCode: false,
            password: false,
            confirmPassword: false
        }

        let errPresent = false

        if(formData.confirmCode !== generatedCode){
            errs.confirmCode = true
            errPresent = true
        }
        if(formData.password.length < 12){
            errs.password = true
            errPresent = true
        }
        if(formData.confirmPassword !== formData.password){
            errs.confirmPassword = true
            errPresent = true
        }

        setShowErr({...showErr, ...errs})

        if(!errPresent){
            const res = await fetch(envVariables.serverURL + "/login/changePassword", { 
                method: "PUT", // Specify the request method
                headers: { "Content-Type": "application/json" }, // Specify the content type
                body: JSON.stringify({
                    password: formData.password,
                    email: formData.email
                }) // Send the data in JSON format
              })

            navigation.navigate("Login")
        }
    }

    return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <View style={{height:30}}></View>

            {!emailSelected ? 
            <>
            <TextInput style={styles.input} placeholder='Email' placeholderTextColor="gray" value ={formData.email} onChangeText={(val) => setFormData({...formData, email:val.toLowerCase()})}></TextInput>
            {showErr.email ? <Text style={styles.error}>No account with this email</Text>:<></>} 
            <TouchableOpacity style={styles.button} onPress={setEmail}>
                <Text style={styles.button_text}>Submit</Text>
            </TouchableOpacity>
            </>

            :

            <>
            <Text style={styles.inputLabel}>Please enter the code we emailed you</Text>
            <TextInput style={styles.input} placeholder='Confirmation Code' placeholderTextColor="gray" value ={formData.confirmCode} onChangeText={(val) => setFormData({...formData, confirmCode:val})}></TextInput>
            {showErr.confirmCode ? <Text style={styles.error}>Code entered does not match</Text> : <></>}
            
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput secureTextEntry = {true} style={styles.input} placeholder='Password' placeholderTextColor="gray" value ={formData.password} onChangeText={(val) => setFormData({...formData, password:val})}></TextInput>
            {showErr.password ? <Text style={styles.error}>Password must be at least 12 characters</Text> : <></>}
            
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput secureTextEntry = {true} style={styles.input} placeholder='Confirm Password' placeholderTextColor="gray" value ={formData.confirmPassword} onChangeText={(val) => setFormData({...formData, confirmPassword:val})}></TextInput>
            {showErr.confirmPassword ? <Text style={styles.error}>Passwords do not match</Text> : <></>}

            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.button_text}>Submit</Text>
            </TouchableOpacity>
            </>
            }


        </View>
    </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        alignItems:'center'
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
    inputLabel:{
        color:"white",
        fontSize: 16,
        alignSelf: "flex-start",
        marginLeft: "10%",
        marginBottom: 10
    },
    error:{
        position: 'relative',
        color: 'red',
        bottom: 20,
        fontSize: 16,
        alignSelf: "flex-start",
        marginLeft: "10%",
    },
    button:{
        width:150,
        height: 70,
        backgroundColor:"#F57600",
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 8,
        marginBottom: 50
    },
    button_text:{
        color:"white",
        fontSize:18,
        fontWeight:"bold"
    }
})