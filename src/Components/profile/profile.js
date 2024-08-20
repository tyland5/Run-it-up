import { StyledButton, StyledText } from "../global/styledComponents";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import React, { useState, useContext, useEffect } from 'react';
import { hs, vs, ms } from "../global/responsiveScaling";
export default function Profile(){
    const pfpBorderRadius = Dimensions.get('window').width * .3 // decimal based on pfp width percentage
    const width = Dimensions.get('window').width
    return(
    <View style={styles.container}>

        <View style={styles.topSection}>
            <Image style={[styles.pfp, {borderRadius:pfpBorderRadius, height:pfpBorderRadius}]} source={require("./pfp-test.png")}/>
            <View style={styles.identification}>
                <StyledText bold>Jontavius Gilgeous-Alexander</StyledText>
                <StyledText>@iversonhehe</StyledText>
                <View style={{height:vs(10)}}></View>
                <StyledButton small>
                    <StyledText bold>Follow</StyledText>
                </StyledButton>
            </View>
        </View>

        <StyledText
        onTextLayout = {(event) =>{
        }}
        numberOfLines={3}>Hello this is gonna be a very long bio Hello this is gonna be a very long bioHello this is gonna be a very long bioHello this is gonna be a very long bio Hello this is gonna be a very long bio </StyledText>

        <View style={styles.followMetrics}>
            <StyledText small>727 Followers</StyledText>
            <StyledText small>727 Following</StyledText>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#121212", 
        flex: 1, 
        width: "100%"
    },
    topSection:{
        paddingTop: vs(20),
        flexDirection:"row",
        alignItems:"center",
        gap: hs(5),
        marginBottom: vs(20)
    },
    pfp:{
        width: "30%"
    },
    followMetrics:{
        flexDirection:"row",
        gap: hs(10),
        marginTop:vs(10)
    }

})