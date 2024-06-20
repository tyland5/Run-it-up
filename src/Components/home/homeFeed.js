import React, { useState, useContext } from 'react';
import {Keyboard,StyleSheet, TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, View, Button } from 'react-native';
import { AuthContext } from '../login/authContext';

const envVariables = require('../../../envVariables.json');

export default function HomeFeed(){
    const [loggedIn, setLoggedIn] = useContext(AuthContext)

    return(
        <View style={styles.container}>
            <Text style={{fontSize:30, color:"white"}}>Home screen</Text>
            <Button title='SIGN OUT' onPress={() => setLoggedIn(false)}></Button>
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