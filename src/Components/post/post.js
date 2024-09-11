import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState, memo, useContext } from 'react';
import {StyleSheet, View, Button, Dimensions, FlatList, TouchableWithoutFeedback, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { StyledText } from '../global/styledComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { hs, vs, ms } from '../global/responsiveScaling';
import React from 'react';
import { AuthContext } from '../login/authContext';
import { useSelector, useDispatch } from 'react-redux'
import { likePost, unlikePost } from './likedPostsStore'

const envVariables = require('../../../envVariables.json');

// need memo here to tell react to not rerender post if its props doesn't change
const Post = memo(function Post({data}){
    const [isDeleted, setIsDeleted] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const liked = useSelector((state) => state.likedPosts.value.hasOwnProperty(data.postId) ? true : false)
    /* essentially same as removing 1 like. 
    IMPORTANT: i might have to store posts by default with their like count and boolean like value to maintain consistency. 
    data.likecount can be different accross screens. EX: profile gets a more updated like count due to fetch */
    const likeCount = useSelector((state) => {
        if(state.likedPosts.value.hasOwnProperty(data.postId)){
            return state.likedPosts.value[data.postId] 
        }
        if(data.liked){ // post is unliked and was liked originally
            return data.likeCount - 1
        }
        return data.likeCount})
    const dispatch = useDispatch()
    const {selfUid, csrfToken, setLoggedIn} = useContext(AuthContext)
    const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');
    const uris =  useMemo(() => {
        if(data.uri !== null){
            return data.uri.split(',')
        }
        return []
    }, [])

    useEffect(()=>{
        console.log("rendering from post 22222222")
    }, [])

    useEffect(()=>{
        console.log("rerendering from post")
    })


    // also considers unlike
    async function likePostHere(){
        let response = {}
        if(liked === true){
            //unlike the post now
            response = await fetch(envVariables.serverURL + "/post/unlikePost",{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                   Accept : "application/json",
                   'x-csrf-token': csrfToken
                },
                body: JSON.stringify({
                    postId: data.postId
                }),
            })
        }
        else{
            // like the post since its not liked yet
            response = await fetch(envVariables.serverURL + "/post/likePost",{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                   Accept : "application/json",
                   'x-csrf-token': csrfToken
                },
                body: JSON.stringify({
                    postId: data.postId
                }),
            })
        }
        if(response.status === 200){
            if(liked){
                dispatch(unlikePost(data.postId))
            }
            else{
                const payload = [data.postId, likeCount+1]
                dispatch(likePost(payload))
            }
        }
        else if(response.status === 401){
            setLoggedIn(false)
        }
    }

    // we set state to get rid of render in the feed without changing data and rerendering the entire list
    async function deletePost(){
        const response = await fetch(envVariables.serverURL + "/post/deletePost",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
               Accept : "application/json",
               'x-csrf-token': csrfToken
            },
            body: JSON.stringify({
                postId: data.postId
            }),
        })

        if(response.status===200){
            setIsDeleted(true)
        }
        else if(response.status === 401){
            setLoggedIn(false)
        }
    }

    const createDeletePostAlert = () =>
        Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', style:'destructive', onPress: () => deletePost()},
    ]);
    
    return(
        <View style={styles.container}>
            {!isDeleted && 
            <>
            <View style={styles.top_section}>
                <TouchableWithoutFeedback onPress={() => navigation.push("Profile", {uid:data.uid})}>
                    <Image style={styles.pfp} source={{uri:data.pfp}}/> 
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.push("Profile", {uid:data.uid})}>
                    <StyledText bold >{data.name}</StyledText>
                </TouchableWithoutFeedback>

                {data.uid === selfUid &&
                <>
                <TouchableWithoutFeedback onPress={() => setShowOptions(!showOptions)}>
                    <View style={{marginLeft:'auto', height:'100%', zIndex:2}}>
                        <StyledText large bold  >...</StyledText>
                    </View>
                </TouchableWithoutFeedback>

                {showOptions && 
                <>
                <TouchableWithoutFeedback onPressIn={()=>setShowOptions(false)}><View style={{zIndex:2, width:width, height:height, position:'absolute'}}></View></TouchableWithoutFeedback>
                <View style={styles.optionsBlock}>
                    <View style={styles.optionsBlockRow}>
                        <StyledText bold>Edit Post</StyledText>
                        <Ionicons name="pencil" size={ms(16)} color={"white"}/>
                    </View>

                    <TouchableWithoutFeedback onPress={() => createDeletePostAlert()}>
                        <View style={styles.optionsBlockRow}>
                            <StyledText bold error>Delete Post</StyledText>
                            <Ionicons name="trash" size={ms(16)} color={"red"}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                </>
                }
                </>} 

            </View>

            { data.uri && 
            <FlatList
                data={uris}
                horizontal={true}
                scrollEnabled={uris.length > 1 ? true : false}
                renderItem={({item, index})=>(
                    <>
                    <TouchableWithoutFeedback onPress={() => navigation.push("MediaGallery" , {media: uris, index: index})}>
                        <Image style={uris.length === 1 ? [styles.imageStyle, {width:width }] : [styles.imageStyle, {width:width * .9 *.9}]} source={{uri: item}}/>
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
                <View style={styles.buttonContainer}>
                    <TouchableWithoutFeedback onPress={()=>likePostHere()}>
                        <Ionicons name={liked ? "heart" : "heart-outline"} size = {ms(25)} color ={liked ? "red" : "white"} />
                    </TouchableWithoutFeedback>
                    <StyledText small bold>{likeCount}</StyledText>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableWithoutFeedback onPress={()=>navigation.push("Comments", {postId: data.postId})}>
                        <Ionicons name="chatbubble-outline" size = {ms(25)} color ={"white"} />
                    </TouchableWithoutFeedback>
                    <StyledText small bold>{data.commentCount}</StyledText>
                </View>
                
                <Ionicons name="arrow-redo-outline" size = {ms(25)} color ={"white"} />
                <Ionicons name="bookmark-outline" size = {ms(25)} color ={"white"} />
            </View>
            </>
            }
        </View>
    )
})

const styles = StyleSheet.create({
    container:{
        width: "90%"
    }, 
    top_section:{
        flexDirection: "row",
        alignItems: 'center',
        paddingRight: vs(5),
        marginVertical: vs(5),
        zIndex:1
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
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: vs(30),
    },
    imageStyle: {
        backgroundColor: 'white',  
        height: vs(300), 
        marginRight:hs(10),
    },
    optionsBlock:{
        backgroundColor: "#121212",
        height:vs(70), 
        width:"50%", 
        position:'absolute', 
        right: 0, 
        top: vs(45),
        gap: vs(15),
        zIndex:2
    },
    optionsBlockRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal: hs(5)
    },
    buttonContainer:{
        flexDirection:'row',
        gap: hs(5),
        alignItems: 'center'
    }
})

export default Post