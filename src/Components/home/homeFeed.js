import React, { useState, useContext, useEffect } from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../login/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { hs, vs, ms } from '../global/responsiveScaling';
import PostList from '../post/postList';

const envVariables = require('../../../envVariables.json');

export default function HomeFeed(){
    const {loggedIn, setLoggedIn} = useContext(AuthContext);
    const [posts, setPosts] = useState(null)
    const navigation = useNavigation();
    

    return(
        <View style={styles.container}>
            <PostList refreshEnabled={true}/>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("MakePost")}><Ionicons style ={styles.postButton} name={"add-circle"} color={"orange"} size={ms(60)}></Ionicons></TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        alignItems:'center',
        width: "100%",
    },
    postButton:{
        position:"absolute",
        bottom: vs(20),
        right: ms(20)
    }
})