import React, { useState, useContext, useEffect } from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../login/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { hs, vs, ms } from '../global/responsiveScaling';
import PostList from '../post/postList';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../post/likedPostsStore';

const envVariables = require('../../../envVariables.json');

export default function HomeFeed(){
    const {selfUid, setLoggedIn} = useContext(AuthContext);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    
    useEffect(()=>{
        // not sure if i like this option much. but this prevents refetching profile info w/ api after edit profile and get info for comment prepend
        async function setProfileInfoRedux(){
            const resp = await fetch(envVariables.serverURL + "/user/getBasicUserInfo?" + new URLSearchParams({uid: selfUid}));
            if(resp.status === 200){
                const respJson = await resp.json()
                dispatch(setUserInfo(respJson.res[0]))
            }
            else if(resp.status === 401){
                setLoggedIn(false)
            }
        }
        setProfileInfoRedux()
    }, [])

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