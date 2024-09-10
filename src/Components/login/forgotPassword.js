import React, { useEffect, useState } from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, ScrollView} from 'react-native';
import { useContext } from 'react';
import { AuthContext } from './authContext';
import { useNavigation } from '@react-navigation/native';
import { vs, hs, ms } from '../global/responsiveScaling';
import { StyledButton, StyledText, StyledTextInput, StyledTextLabel } from '../global/styledComponents';
import styled from 'styled-components';

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
        let resJson = null;
        if(res.status === 200){
            resJson = await res.json();
        }

        if(res.status !== 200 || !resJson.validEmail){
            setShowErr({...showErr, email: true})
            return
        }
        setShowErr({...showErr, email: false})

        // if email is valid, get confirmation code and show change pass inputs
        const res2 = await fetch(envVariables.serverURL + "/login/confirmEmail?" + new URLSearchParams({email:formData.email}));
        let resJson2 = null
        if(res2.status === 200){
            resJson2 = await res2.json();
        }

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
        const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,16}$/

        if(formData.confirmCode !== generatedCode){
            errs.confirmCode = true
            errPresent = true
        }
        if(!pwRegex.test(formData.password)){
            errs.password = true
            errPresent = true
        }
        if(formData.confirmPassword === "" || formData.confirmPassword !== formData.password){
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
            <View style={{height: vs(30)}}></View>

            {!emailSelected ? 
            <>
            <StyledTextInput placeholder='Email' placeholderTextColor="gray" value ={formData.email} onChangeText={(val) => setFormData({...formData, email:val.toLowerCase()})}></StyledTextInput>
            {showErr.email ? 
            <View style={{marginTop:vs(10), alignSelf:"flex-start", marginLeft:"10%"}}>
            <StyledText error>No account with this email</StyledText>
            </View>:<></>} 

            <View style={{height: vs(30)}}></View>
            <StyledButton large onPress={setEmail}>
                <StyledText bold>Submit</StyledText>
            </StyledButton>
            </>

            :

            <>
            <StyledTextLabel>Please enter the code we emailed you</StyledTextLabel>
            <StyledTextInput placeholder='Confirmation Code' placeholderTextColor="gray" value ={formData.confirmCode} onChangeText={(val) => setFormData({...formData, confirmCode:val})}></StyledTextInput>
            <View style= {styles.input_space}></View>
            {showErr.confirmCode ? <StyledTextLabel error>Code entered does not match</StyledTextLabel> : <></>}

            <StyledTextLabel>Password</StyledTextLabel>
            <StyledTextInput secureTextEntry = {true} placeholder='Password' placeholderTextColor="gray" value ={formData.password} onChangeText={(val) => setFormData({...formData, password:val})}></StyledTextInput>
            <View style= {styles.input_space}></View>
            {showErr.password ? <StyledTextLabel error>{`At least one lowercase alphabet i.e. [a-z]\nAt least one uppercase alphabet i.e. [A-Z]\nAt least one Numeric digit i.e. [0-9]\nAt least one special character i.e. ['@', '$', '.', '#', '!', '%', '*', '?', '&', '^']\nTotal length must be in the range [8-16]`}</StyledTextLabel> : <></>}
            
            <StyledTextLabel>Confirm Password</StyledTextLabel>
            <StyledTextInput secureTextEntry = {true} placeholder='Confirm Password' placeholderTextColor="gray" value ={formData.confirmPassword} onChangeText={(val) => setFormData({...formData, confirmPassword:val})}></StyledTextInput>
            <View style= {styles.input_space}></View>
            {showErr.confirmPassword ? <StyledTextLabel error>Passwords do not match</StyledTextLabel> : <></>}

            <StyledButton large onPress={handleConfirm}>
                <StyledText bold>Submit</StyledText>
            </StyledButton>
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
    input_space:{
        height: vs(10)
    }
})