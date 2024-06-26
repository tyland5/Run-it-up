import React, { useState } from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, ScrollView} from 'react-native';
import { useContext } from 'react';
import { AuthContext } from './authContext';

const envVariables = require('../../../envVariables.json');

export default function EmailConfirm(){

    const [confCode, setConfCode] = useState('')

    function handleConfirm(){
        console.log("OOF")
    }

    return(
    <View style={styles.container}>
        <View style={{height:30}}></View>
        <Text style={styles.inputLabel}>We've sent you an email with a confirmation code. Please enter it</Text> 
        <TextInput style={styles.input} placeholder='Confirmation Code' placeholderTextColor="gray" value ={confCode} onChangeText={(code) => setConfCode(code)}></TextInput>

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.button_text}>Submit</Text>
        </TouchableOpacity>
    </View>
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