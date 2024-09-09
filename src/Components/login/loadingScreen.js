import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './authContext';
import { useNavigation } from '@react-navigation/native';
import { vs, hs, ms } from '../global/responsiveScaling';
import {ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, ScrollView} from 'react-native';
import { StyledText, StyledVertSpace } from '../global/styledComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';

const envVariables = require('../../../envVariables.json');

export default function LoadingScreen(){
    const {setSelfUid, setCsrfToken, setLoggedIn} = useContext(AuthContext)
    const navigation = useNavigation()
    
    useEffect(()=>{
        const loginTimeout = setTimeout(() => {checkIfLoggedIn()}, 1000)
        return () => clearTimeout(loginTimeout);
    },[])

    // check if user has existing session. if not then have them log in
    // need to make another page and put this in there. have to render that page first instead of login since logged in user sees login page
    const checkIfLoggedIn = async() =>{
        const resp = await fetch(envVariables.serverURL + "/login/checkIfLoggedIn")
        
        if(resp.status !== 401){
            try{    
                const selfUid = await AsyncStorage.getItem('uid')
                const csrfToken = await AsyncStorage.getItem('csrf-token')
                setSelfUid(parseInt(selfUid))
                setCsrfToken(csrfToken)
                setLoggedIn(true)
            }
            catch {
                // no valid uid or csrf token to be recovered from storage
                navigation.navigate("Login")
            }
        }

        navigation.navigate("Login")
        
    }

    return(
        <View style={styles.container}>
            <StyledText color = "orange" xlarge> Run It Up</StyledText>
            <StyledVertSpace space={40}></StyledVertSpace>
            <ActivityIndicator size="large" color="orange" />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        alignItems:'center',
        paddingTop: '40%'
    },
})