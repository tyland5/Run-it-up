import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'

const envVariables = require('../../../envVariables.json');

export default function Register(){

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPass: '',
        fname: '',
        lname: '',
        email: ''
    })

    const [formErr, setFormErr] = useState({
        username: false,
        password: false,
        confirmPass: false,
        fname: false,
        lname: false,
        email: false,
        usernameDup: false,
        emailDup: false
    })

    const headerHeight = useHeaderHeight()
    const navigation = useNavigation()

    async function handleRegister(){
        let numErr = 0
        const err = {
            username: false,
            password: false,
            confirmPass: false,
            fname: false,
            lname: false,
            email: false,
            usernameDup: false,
            emailDup: false
        }
        
        if(formData.username.length < 1){
            numErr += 1
            err.username = true
        }
        if (formData.email.length == 0 || !formData.email.match(/\S+@\S+\.\S+/) ){
            err.email = true
            numErr += 1
        }
        if(formData.password.length < 12){
            numErr += 1
            err.password = true
        }
        if(formData.confirmPass !== formData.password){
            numErr += 1
            err.confirmPass = true
        }
        if(formData.fname < 1){
            numErr += 1
            err.fname = true
        }
        if(formData.lname < 1){
            numErr += 1
            err.lname = true
        }
        

        // Check if a created account has the same username or email
        const res = await fetch(envVariables.serverURL + "/login/checkUsernameEmail?" + new URLSearchParams({email:formData.email, username: formData.username}));

        const jsonRes = await res.json();
        err.usernameDup = !jsonRes.validUser
        err.emailDup = !jsonRes.validEmail
        
        if(jsonRes.response === "bad" || !jsonRes.validUser || !jsonRes.validEmail){
            numErr += 1
        }

        if(numErr === 0){
            
            fetch(envVariables.serverURL +"/login/confirmEmail?" + new URLSearchParams({email:formData.email}))
            .then(response => response.json())
            .then(data => {
                if(data.response === "good"){
                    navigation.navigate("Confirmation", {generatedCode: data.confCode, accountDetails: formData})
                }
            })
            
        }

        setFormErr(err)
    }

    return(
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={headerHeight}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={{backgroundColor:"#121212"}}>
            <View style={styles.container}>
                <View style={{height:30}}></View>
                
                <Text style={styles.inputLabel}>Username <Text style={styles.mandatory}>*</Text> </Text>
                <TextInput style={styles.input} placeholder='Username' placeholderTextColor="gray" value={formData.username} onChangeText={(val) => setFormData({...formData, username:val.toLowerCase()})}></TextInput>
                {formErr.username ? <Text style={styles.error}>Please enter a non empty username</Text> : <></>}
                {formErr.usernameDup ? <Text style={styles.error}>This username is already taken</Text> : <></>}

                <Text style={styles.inputLabel}>First Name <Text style={styles.mandatory}>*</Text> </Text>
                <TextInput style={styles.input} placeholder='First Name' placeholderTextColor="gray" value={formData.fname} onChangeText={(val) => setFormData({...formData, fname:val})}></TextInput>
                {formErr.fname ? <Text style={styles.error}>Please enter a non empty first name</Text> : <></>}

                <Text style={styles.inputLabel}>Last Name <Text style={styles.mandatory}>*</Text> </Text>
                <TextInput style={styles.input} placeholder='Last name' placeholderTextColor="gray" value={formData.lname} onChangeText={(val) => setFormData({...formData, lname:val})}></TextInput>
                {formErr.lname ? <Text style={styles.error}>Please enter a non empty last name</Text> : <></>}

                <Text style={styles.inputLabel}>Email <Text style={styles.mandatory}>*</Text> </Text>
                <TextInput style={styles.input} placeholder='Email' placeholderTextColor="gray" value={formData.email} onChangeText={(val) => setFormData({...formData, email:val.toLowerCase()})}></TextInput>
                {formErr.email ? <Text style={styles.error}>Please enter a valid email</Text> : <></>}
                {formErr.emailDup ? <Text style={styles.error}>This email is already in use</Text> : <></>}

                <Text style={styles.inputLabel}>Password <Text style={styles.mandatory}>*</Text> </Text>
                <TextInput secureTextEntry = {true} style={styles.input} placeholder='Password' placeholderTextColor="gray" value={formData.password} onChangeText={(val) => setFormData({...formData, password:val})}></TextInput>
                {formErr.password ? <Text style={styles.error}>Please enter a password of at least 12 characters</Text> : <></>}

                <Text style={styles.inputLabel}>Confirm Password <Text style={styles.mandatory}>*</Text> </Text>
                <TextInput secureTextEntry = {true} style={styles.input} placeholder='Confirm password' placeholderTextColor="gray" value={formData.confirmPass} onChangeText={(val) => setFormData({...formData, confirmPass:val})}></TextInput>
                {formErr.confirmPass ? <Text style={styles.error}>Passwords do not match</Text> : <></>}

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.button_text}>Register</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        alignItems:'center'
    },
    header:{
        color:"white",
        fontSize:24,
        marginBottom: 20
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
    mandatory:{
        color:"red",
        fontSize:16
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
        marginBottom: 60
    },
    button_text:{
        color:"white",
        fontSize:18,
        fontWeight:"bold"
    }
})