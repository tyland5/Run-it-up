import {Animated, Alert, View, StyleSheet, FlatList, Image, Dimensions, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native"
import { StyledText } from "../global/styledComponents"
import { vs, hs, ms } from "../global/responsiveScaling"
import { useCallback, useEffect, useState, useMemo, useContext } from "react"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../login/authContext";
import { useHeaderHeight } from '@react-navigation/elements'
import { useSelector } from "react-redux";
import { RectButton} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

const pfpDimensions = Dimensions.get('window').width * .12
const envVariables = require('../../../envVariables.json');

function Comment({uid, commentId, pfp, name, username, comment}){
    const [restrictComment, setRestrictComment] = useState(false)
    const [showComment, setShowComment] = useState(true)
    const [showLess, setShowLess] = useState(false)
    const {selfUid, csrfToken} = useContext(AuthContext)

    const createDeleteCommentAlert = () =>
        Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Delete', style:'destructive', onPress: () => deleteComment()},
    ]);

    const deleteComment = async () =>{
        const response = await fetch(envVariables.serverURL + "/post/deleteComment",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
               Accept : "application/json",
               'x-csrf-token': csrfToken
            },
            body: JSON.stringify({
                commentId: commentId
            }),
        }) 

        if(response.status === 200){
            setShowComment(false)
        }
    }

    renderRightActions = (progress, dragX) => {
        
        const trans = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [hs(70), 0],
          extrapolate: 'clamp',
        });
        
       
        return (
          <RectButton onPress={() => createDeleteCommentAlert()}>
            <Animated.View
              style={[
                {backgroundColor:'red', height:'100%', width:hs(70), justifyContent:'center', alignItems:'center'},

                {transform: [{ translateX: trans }]},
              ]}>
              <Ionicons name="trash" color="white" size={ms(30)}></Ionicons>
            </Animated.View>
          </RectButton>
        );
      };


    return(
    <>
    {showComment && 
    <Swipeable
        ref={null}
        friction={2}
        rightThreshold={30}
        renderRightActions={selfUid === uid ? renderRightActions : ()=>{}}>
        <View style={{flexDirection:'row', paddingLeft:hs(10), gap:hs(10), marginBottom:vs(20)}}>
            <Image style={{width: pfpDimensions, height: pfpDimensions, borderRadius: pfpDimensions}} source={{uri:pfp}} />
            <View style={{flex: 1}}>
                <StyledText bold>{name}</StyledText>

                {/* comment itself */}
                <StyledText onTextLayout = {(event) =>{
                    if(event.nativeEvent.lines.length > 3 && !showLess){
                        setRestrictComment(true)
                    }
                }}
                numberOfLines={restrictComment ? 3 : 0}>{comment}</StyledText>

                {restrictComment && !showLess && 
                <TouchableWithoutFeedback onPress={() => {setShowLess(true); setRestrictComment(false)}}><StyledText small bold>Show More...</StyledText></TouchableWithoutFeedback>}
                {showLess && <TouchableWithoutFeedback onPress={() => {setShowLess(false); setRestrictComment(true)}}><StyledText small bold>Show Less...</StyledText></TouchableWithoutFeedback>}
            </View>
        </View>
    </Swipeable>
    }
    </>
    )
}

export default function CommentSection({route}){
    // this is necessary since im use react navigator with header. https://stackoverflow.com/questions/48420468/keyboardavoidingview-not-working-properly
    const height = useHeaderHeight()
    const [newComment, setNewComment] = useState('')
    const [preComments, setPreComments] = useState('')
    const {csrfToken, selfUid} = useContext(AuthContext)
    const comments = useMemo(()=> { return preComments}, [preComments])
    const uInfo = useSelector((state) => state.accountInfo.value)
    
    // 12345678901234567890123456789012345678901234567890
    useEffect(() => {
        fetchComments()
    },[])

    async function fetchComments(){
        const res = await fetch(envVariables.serverURL + "/post/getComments?" + new URLSearchParams({postId: route.params.postId}));
        let jsonRes = null 
        if(res.status===200){
            jsonRes = await res.json();
        }

        setPreComments(jsonRes.res)
    }

    async function postComment(){
        const response = await fetch(envVariables.serverURL + "/post/postComment",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
               Accept : "application/json",
               'x-csrf-token': csrfToken
            },
            body: JSON.stringify({
                postId: route.params.postId,
                comment: newComment
            }),
        }) // might need to return the new comment id for when i implement delete comment feature

        if(response.status === 200){
            const respJson = await response.json()
            
            setPreComments([{uid: selfUid, comment_id: respJson.res, pfp: uInfo.pfp, name:uInfo.name, username: uInfo.username, comment:newComment}, ...preComments])
            setNewComment("")
        }
    }

    return(
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? height : 0}
        style={styles.container}>
            <FlatList
                data= {comments}
                keyExtractor={useCallback(comment=> comment.comment_id, [])}
                ListHeaderComponent={useCallback(() => <View style={{height:vs(15)}}></View>,[])}
                renderItem={useCallback(({item})=>(
                    <Comment uid = {item.uid} commentId = {item.comment_id} pfp={item.pfp} name={item.name} username={item.username} comment={item.comment} />
                ),[comments])}
            />
            <View style={styles.makeComment}>
                <Image style={{width: pfpDimensions * .83, height: pfpDimensions * .83, borderRadius: pfpDimensions * .83}} source={{uri:uInfo.pfp}} />
                <TextInput onChangeText={(val) => setNewComment(val)} value={newComment} multiline={true} maxLength={500} style={styles.commentInput} placeholder="Post a comment" placeholderTextColor={"gray"}/>
                {newComment !== "" && <TouchableWithoutFeedback onPress={() => postComment()}><Ionicons name="send" size = {ms(25)} color ={"orange"} /></TouchableWithoutFeedback>}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:"#121212", 
        flex: 1, 
        width: "100%"
    },
    makeComment: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"#121212", 
        borderTopWidth: ms(1),
        borderTopColor: 'white',
        gap: hs(10),
        paddingVertical: vs(5),
        paddingHorizontal: hs(5)
    },
    commentInput:{
        width: '75%',
        fontSize: ms(16),
        borderWidth: ms(1),
        borderColor:'white',
        borderRadius: 20,
        maxHeight: vs(120),
        padding:ms(10),
        color: 'white'
    }
})