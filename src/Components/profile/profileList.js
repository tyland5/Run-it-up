import React, { useCallback } from "react";
import { useEffect, memo, useState } from "react";
import { FlatList, StyleSheet, View, Dimensions, Image } from "react-native";
import { StyledText, StyledButton } from "../global/styledComponents";
import { vs, ms, hs } from "../global/responsiveScaling";

const pfpDimensions = Dimensions.get('window').width * .15

// dont need to worry about memo here since changing state would only affect this component. state is not part of the bigger profile list
function ProfileEntry({profile}){
    const [isFollowing, setIsFollowing] = useState(false)

    return(
        <View style={styles.profileEntryContainer}>
            <Image style ={{width: pfpDimensions, height: pfpDimensions, borderRadius: pfpDimensions}} source={require('./pfp-test.png')}/>
            
            <View>
                <StyledText small>Full name will be right here</StyledText>
                <StyledText small>Username will be right here</StyledText>
            </View>
            
            {!isFollowing && 
            <View style={{margin:'auto'}}>
                <StyledButton onPress={() => setIsFollowing(true)}>
                    <StyledText small bold>Follow</StyledText>
                </StyledButton>
            </View>
            }
        </View>
    )
}


// when we use it in tab view or somewhere else, we are responsible for this view not refreshing when not needed
const ProfileList = memo(function ProfileList(props){
    const data = props.data
    useEffect(()=>{
        //idk
        console.log("render from prof list")
        console.log(props)
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
        paddingHorizontal:hs(5)
    }
})

export default ProfileList