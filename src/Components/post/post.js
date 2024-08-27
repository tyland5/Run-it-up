import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import {StyleSheet, View, Button, Image, Dimensions, FlatList, TouchableWithoutFeedback } from 'react-native';
import { StyledText } from '../global/styledComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { hs, vs, ms } from '../global/responsiveScaling';
import React from 'react';

// need memo here to tell react to not rerender post if its props doesn't change
const Post = memo(function Post({data}){

    const navigation = useNavigation();
    const uris =  useMemo(() => {
        if(data.uri !== null){
            return data.uri.split(',')
        }
        return []
    }, [])

    useEffect(()=>{
        console.log("rerendering from post 22222222")
    }, [])

    useEffect(()=>{
        console.log("rerendering from post")
    })
    
    return(
        <View style={styles.container}>
            <View style={styles.top_section}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("Profile", {uid:data.uid})}>
                    <Image style={styles.pfp} source={{uri:data.pfp}}/> 
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("Profile", {uid:data.uid})}>
                    <StyledText bold >{data.name}</StyledText>
                </TouchableWithoutFeedback>
            </View>
            { data.uri && 
            <FlatList
                data={uris}
                horizontal={true}
                renderItem={({item, index})=>(
                    <>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate("MediaGallery" , {media: uris, index: index})}>
                        <Image style={uris.length === 1 ? [styles.imageStyle, {width:Dimensions.get('screen').width * .9}] : [styles.imageStyle, {width:Dimensions.get('screen').width * .9 *.9}]} source={{uri: item}}/>
                    </TouchableWithoutFeedback>
                    </>
                )}
                showsHorizontalScrollIndicator={false}
            />
}

            <View style={styles.caption}>
                <StyledText>{data.caption}</StyledText>
            </View>

            <View style={styles.activityBar}>
                <Ionicons name="heart-outline" size = {ms(25)} color ={"white"} />
                <Ionicons name="chatbubble-outline" size = {ms(25)} color ={"white"} />
                <Ionicons name="arrow-redo-outline" size = {ms(25)} color ={"white"} />
                <Ionicons name="bookmark-outline" size = {ms(25)} color ={"white"} />
            </View>
        </View>)
})

const styles = StyleSheet.create({
    container:{
        width: "90%",
    }, 
    top_section:{
        flexDirection: "row",
        alignItems: 'center',
        paddingRight: vs(5),
        marginVertical: vs(5)
    },
    pfp:{
        width: hs(40),
        height: vs(40),
        borderRadius:hs(20),
        borderWidth: hs(1),
        marginRight: hs(5)
    },
    media:{
        marginBottom: vs(10),
        flexDirection: "row",
        gap: hs(10),
        overflow:'hidden'
    },
    caption:{
        marginBottom: vs(10),
        marginTop: vs(10)
    },
    activityBar:{
        flexDirection:'row',
        justifyContent: 'space-evenly'
    },
    imageStyle: {
        backgroundColor: 'white',  
        height: vs(300), 
        marginRight:hs(10)
    }
})

export default Post