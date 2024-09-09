import React, { useCallback, useContext } from "react";
import { useEffect, memo, useState, useRef } from "react";
import { FlatList, StyleSheet, View, Dimensions, TouchableWithoutFeedback, TextInput, ScrollView, Platform} from "react-native";
import { Image } from "expo-image";
import { StyledText, StyledButton, StyledTextInput } from "../global/styledComponents";
import { vs, ms, hs } from "../global/responsiveScaling";
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfo } from '../post/likedPostsStore';
import { AuthContext } from "../login/authContext";

const envVariables = require('../../../envVariables.json');

// these should be outside the component to prevent rerender. form input especially doesnt work when in editprofile
const FormLabel = styled(StyledText)`
        paddingHorizontal: ${hs(10)}px;
        paddingVertical: 0px
    ` 
const FormInput = styled(StyledTextInput)`
    width: 100%;
    paddingTop: 0px;
    borderWidth: 0px;
    borderBottomWidth:${ms(1)}px
`

export default function EditProfile({route}){
    const navigation = useNavigation()
    const pfpDimensions= Dimensions.get('window').width * .3 
    const {selfUid, csrfToken} = useContext(AuthContext)
    const uInfo = useSelector((state) => state.accountInfo.value)
    const[formData, setFormData] = useState({
        pfp: uInfo.pfp,
        name: uInfo.name,
        username: uInfo.username,
        bio: uInfo.bio
    })
    const[characterCount, setCharacterCount] = useState(uInfo.bio.length)
    const pfpObject = useRef([])
    const dispatch = useDispatch()
    

    async function pickProfilePicture(){
        await ImagePicker.requestMediaLibraryPermissionsAsync() // this only asks if there are no access privileges

        const result = await ImagePicker.launchImageLibraryAsync({allowsEditing: true})
        if(!result.canceled){
            setFormData({ ...formData, pfp:result.assets[0].uri})
            pfpObject.current = result.assets
        }
    }

    async function changeProfileInfo(){
        // do some checks here?

        const data = new FormData();
        data.append("name", formData.name)
        data.append("username", formData.username)
        data.append("bio", formData.bio)
        
        let newUri = ""
        if(pfpObject.current.length !== 0){
            const info = pfpObject.current[0]
            const extension = info.mimeType.split("/")[1]
            data.append("media", {
                name: `${selfUid}_pfp${Date.now()}.jpg`, // Forced all images to be jpg to allow refresh of pfp in 
                type: info.type,
                uri: Platform.OS === "android" ? info.uri : info.uri.replace("file://", "")
            })
            newUri = Platform.OS === "android" ? info.uri : info.uri.replace("file://", "")
        }
       

        const response = await fetch(envVariables.serverURL +"/user/changeUserInfo", {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              "X-CSRF-Token": csrfToken
            },
            body: data
        })

        if(response.status === 200){
            if(pfpObject.current.length !== 0){
                dispatch(setUserInfo({...formData, pfp:newUri}))
            }
            else{
                dispatch(setUserInfo({...formData}))
            }
            navigation.goBack()
        }
    }

    return(
        <ScrollView style={styles.container} keyboardDismissMode="on-drag">
        <View>
            <TouchableWithoutFeedback onPress={() => pickProfilePicture()}>
                <View>
                    <Image style={[styles.pfp, {borderRadius:pfpDimensions, height:pfpDimensions, width:pfpDimensions}]} source={{uri: formData.pfp}}/>
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.infoSection}>
                <View style={styles.label}>
                    <FormLabel bold>Name</FormLabel>
                </View>
                <View style={styles.input}>
                    <FormInput keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'} placeholder='Name' placeholderTextColor="gray" value ={formData.name} onChangeText={(val) => setFormData({...formData, name:val})}></FormInput>
                    {formData.name.length > 40 && <StyledText error>40 characters or less</StyledText>}
                    {formData.name.length === 0 && <StyledText error>Name must be nonempty</StyledText>}
                </View>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.label}>
                    <FormLabel bold>Username</FormLabel>
                </View>
                <View style={styles.input}>
                    <FormInput keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'} placeholder='Username' placeholderTextColor="gray" value ={formData.username} onChangeText={(val) => setFormData({...formData, username:val.toLowerCase()})}></FormInput>
                    {formData.username.length > 20 && <StyledText error>20 characters or less</StyledText>}
                    {formData.username.length === 0 && <StyledText error>Username must be nonempty</StyledText>}
                </View>
            </View>

            <View style={styles.infoSection}>
                <View style={[styles.label, {alignSelf:"flex-start"}]}>
                    <FormLabel bold>Bio</FormLabel>
                    <FormLabel small>{characterCount} / 140</FormLabel>
                </View>
                <View style={styles.input}>
                    <FormInput multiline={true} height={vs(100)} placeholder='Bio' placeholderTextColor="gray" value ={formData.bio} onChangeText={(val) => {setCharacterCount(val.length); setFormData({...formData, bio:val})}}></FormInput>
                    {characterCount > 140 && <StyledText error>140 characters or less</StyledText>}
                </View>
            </View>
            
            { !(formData.name.length > 40) && !(formData.name.length === 0) && !(formData.username.length > 20) && !(formData.username.length === 0) && !(characterCount > 140) &&
            <View style={{alignSelf:'center', marginTop:vs(20)}}>
                <StyledButton large onPress={()=> changeProfileInfo()}>
                    <StyledText bold>Save Info</StyledText>
                </StyledButton>
            </View>
            }

        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#121212", 
        flex: 1, 
        width: "100%"
    },
    pfp:{
        alignSelf:"center",
        marginTop: vs(20),
        marginBottom: vs(20),
    },
    infoSection:{
        flexDirection: 'row',
        width: "100%",
        marginBottom: vs(30),
    },
    label:{
        width: '30%'
    },
    input:{
        width: '70%'
    }
})