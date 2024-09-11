import React, { useCallback } from "react";
import { useEffect, memo, useState, useContext } from "react";
import { FlatList, StyleSheet, View, Dimensions, Image, Pressable } from "react-native";
import { StyledText, StyledButton } from "../global/styledComponents";
import { vs, ms, hs } from "../global/responsiveScaling";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../login/authContext";

const pfpDimensions = Dimensions.get('window').width * .15
const envVariables = require('../../../envVariables.json');

// dont need to worry about memo here since changing state would only affect this component. state is not part of the bigger profile list
function ProfileEntry({profile}){
    const {selfUid, csrfToken, setLoggedIn} = useContext(AuthContext);
    const [isFollowing, setIsFollowing] = useState(profile.hasOwnProperty('mutual') && profile.mutual == null && profile.uid != selfUid ? false : true)
    const navigation = useNavigation();
    
    useEffect(()=>{
    },[])


    const followUser = async() =>{

        const res = await fetch(envVariables.serverURL +"/user/followUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
               Accept : "application/json",
              "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify({followingId: profile.uid})
        })

        if(res.status === 200){
            setIsFollowing(true)
        }
        else if(res.status === 401){
            setLoggedIn(false)
        }
    }

    return(
        <Pressable onPress={()=> navigation.push("Profile", {uid:profile.uid})}>
        <View style={styles.profileEntryContainer}>
            <Image style ={{width: pfpDimensions, height: pfpDimensions, borderRadius: pfpDimensions}} source={{uri:profile.pfp}}/>
            
            <View>
                <StyledText small bold>{profile.name}</StyledText>
                <StyledText small>@{profile.username}</StyledText>
            </View>
            
            {!isFollowing && 
            <View style={{marginLeft:'auto', zIndex:2}}>
                <StyledButton onPress={() => followUser()}>
                    <StyledText small bold>Follow</StyledText>
                </StyledButton>
            </View>
            }
        </View>
        </Pressable>
    )
}


// when we use it in tab view or somewhere else, we are responsible for this view not refreshing when not needed
const ProfileList = memo(function ProfileList(props){
    const data = props.data
    useEffect(()=>{
    })

    return(
        <View style={styles.container}>
            <FlatList 
                data = {data}
                ItemSeparatorComponent={useCallback(() => {return (<View style={{height:vs(15)}}></View>)}, [])} 
                ListFooterComponent={<View style={{height:vs(20)}}></View>}
                renderItem={({item}) =>{
                    return(
                        <ProfileEntry profile={item} />
                    )
                }}
            />
        </View>
    )
})


const styles = StyleSheet.create({
    container:{
        marginTop: vs(10),
        backgroundColor:"#121212", 
        flex: 1, 
        width: "100%"
    },
    profileEntryContainer:{
        flexDirection:'row',
        alignItems:"center",
        gap:hs(10),
        paddingHorizontal:hs(10)
    }
})

export default ProfileList