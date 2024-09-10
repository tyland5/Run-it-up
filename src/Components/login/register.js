import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, ScrollView, Platform, KeyboardAvoidingView, Dimensions} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import styled from 'styled-components';
import { StyledButton, StyledText, StyledTextInput, StyledTextLabel } from '../global/styledComponents';
import { vs, hs, ms } from '../global/responsiveScaling';
import { checkIfValidChar } from '../../functions/global';

const envVariables = require('../../../envVariables.json');

export default function Register(){

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPass: '',
        name: '',
        email: ''
    })

    const [formErr, setFormErr] = useState({
        username: false,
        password: false,
        confirmPass: false,
        name: false,
        email: false,
        usernameDup: false,
        emailDup: false
    })

    const headerHeight = useHeaderHeight()
    const navigation = useNavigation()
    const screenHeight = Dimensions.get('window').height;

    handleUsername = (val) =>{
        if(checkIfValidChar(val)){
            setFormData({...formData, username:val.toLowerCase()})
        }
    }

    async function handleRegister(){
        let numErr = 0
        const err = {
            username: false,
            password: false,
            confirmPass: false,
            name: false,
            email: false,
            usernameDup: false,
            emailDup: false
        }
        const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,16}$/
        
        if(formData.username.length < 1){
            numErr += 1
            err.username = true
        }
        if (formData.email.length == 0 || !formData.email.match(/\S+@\S+\.\S+/) ){
            err.email = true
            numErr += 1
        }
        if(!pwRegex.test(formData.password)){
            numErr += 1
            err.password = true
        }
        if(formData.confirmPass !== formData.password){
            numErr += 1
            err.confirmPass = true
        }
        if(formData.name < 1){
            numErr += 1
            err.name = true
        }
        

        // Check if a created account has the same username or email
        const res = await fetch(envVariables.serverURL + "/login/checkUsernameEmail?" + new URLSearchParams({email:formData.email, username: formData.username}));
        let jsonRes = null

        if(res.status === 200){
            jsonRes = await res.json();
            err.usernameDup = !jsonRes.validUser
            err.emailDup = !jsonRes.validEmail
        }
        
        if(res.status !== 200 || !jsonRes.validUser || !jsonRes.validEmail){
            numErr += 1
        }

        if(numErr === 0){
            fetch(envVariables.serverURL +"/login/confirmEmail?" + new URLSearchParams({email:formData.email}))
            .then(response => response.json())
            .then(data => {
                navigation.navigate("Confirmation", {generatedCode: data.confCode, accountDetails: formData})
                
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
                <StyledTextInput keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'} maxLength={20} placeholder='Username' placeholderTextColor="gray" value={formData.username} onChangeText={(val) => handleUsername(val)}></StyledTextInput>
                {formErr.username ? <StyledTextLabel error >Please enter a non empty username</StyledTextLabel> : <></>}
                {formErr.usernameDup ? <StyledTextLabel error>This username is already taken</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledTextLabel>Name <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'} maxLength={40} placeholder='Name' placeholderTextColor="gray" value={formData.name} onChangeText={(val) => setFormData({...formData, name:val})}></StyledTextInput>
                {formErr.name ? <StyledTextLabel error>Please enter a non empty name</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledTextLabel>Email <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'} placeholder='Email' placeholderTextColor="gray" value={formData.email} onChangeText={(val) => setFormData({...formData, email:val.toLowerCase()})}></StyledTextInput>
                {formErr.email ? <StyledTextLabel error>Please enter a valid email</StyledTextLabel> : <></>}
                {formErr.emailDup ? <StyledTextLabel error>This email is already in use</StyledTextLabel> : <></>}
                <View style={{height: vs(15)}}></View>

                <StyledTextLabel>Password <StyledText color="red">*</StyledText> </StyledTextLabel>
                <StyledTextInput secureTextEntry = {true} placeholder='Password' placeholderTextColor="gray" value={formData.password} onChangeText={(val) => setFormData({...formData, password:val})}></StyledTextInput>
                {formErr.password ? <StyledTextLabel error>{`At least one lowercase alphabet i.e. [a-z]\nAt least one uppercase alphabet i.e. [A-Z]\nAt least one Numeric digit i.e. [0-9]\nAt least one special character i.e. ['@', '$', '.', '#', '!', '%', '*', '?', '&', '^']\nTotal length must be in the range [8-16]`}</StyledTextLabel> : <></>}
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