import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, ScrollView, Platform, KeyboardAvoidingView, Dimensions} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import styled from 'styled-components';
import { StyledButton, StyledText, StyledTextInput, StyledTextLabel } from '../global/styledComponents';
import { vs, hs, ms } from '../global/responsiveScaling';

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
    const screenHeight = Dimensions.get('window').height;


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
            <View style={[styles.container,{height: screenHeight}]}>
                <View style={{height: vs(30)}}></View>
                
                <StyledTextLabel>Username <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput placeholder='Username' placeholderTextColor="gray" value={formData.username} onChangeText={(val) => setFormData({...formData, username:val.toLowerCase()})}></StyledTextInput>
                {formErr.username ? <StyledTextLabel error >Please enter a non empty username</StyledTextLabel> : <></>}
                {formErr.usernameDup ? <StyledTextLabel error>This username is already taken</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledTextLabel>First Name <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput placeholder='First Name' placeholderTextColor="gray" value={formData.fname} onChangeText={(val) => setFormData({...formData, fname:val})}></StyledTextInput>
                {formErr.fname ? <StyledTextLabel error>Please enter a non empty first name</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledTextLabel>Last Name <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput placeholder='Last name' placeholderTextColor="gray" value={formData.lname} onChangeText={(val) => setFormData({...formData, lname:val})}></StyledTextInput>
                {formErr.lname ? <StyledTextLabel error>Please enter a non empty last name</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledTextLabel>Email <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput placeholder='Email' placeholderTextColor="gray" value={formData.email} onChangeText={(val) => setFormData({...formData, email:val.toLowerCase()})}></StyledTextInput>
                {formErr.email ? <StyledTextLabel error>Please enter a valid email</StyledTextLabel> : <></>}
                {formErr.emailDup ? <StyledTextLabel error>This email is already in use</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledTextLabel>Password <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput secureTextEntry = {true} placeholder='Password' placeholderTextColor="gray" value={formData.password} onChangeText={(val) => setFormData({...formData, password:val})}></StyledTextInput>
                {formErr.password ? <StyledTextLabel error>Please enter a password of at least 12 characters</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledTextLabel>Confirm Password <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput secureTextEntry = {true} placeholder='Confirm password' placeholderTextColor="gray" value={formData.confirmPass} onChangeText={(val) => setFormData({...formData, confirmPass:val})}></StyledTextInput>
                {formErr.confirmPass ? <StyledTextLabel error>Passwords do not match</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledButton large onPress={handleRegister}>
                    <StyledText bold>Register</StyledText>
                </StyledButton>
                <View style={{height: vs(30)}}></View>
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
})