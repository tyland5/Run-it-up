import React, { useState, useContext } from 'react';
import {StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../login/authContext';

const envVariables = require('../../../envVariables.json');

export default function HomeFeed(){
    const [loggedIn, setLoggedIn] = useContext(AuthContext);
    const navigation = useNavigation();

    return(
        <View style={styles.container}>
            <Text style={{fontSize:30, color:"white"}}>Home screen</Text>
            <Button title='SIGN OUT' onPress={() => setLoggedIn(false)}></Button>
            <Button title='Expand Post' onPress={() => navigation.navigate("ExpandedPost")}></Button>
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