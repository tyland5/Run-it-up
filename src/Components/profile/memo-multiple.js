import { StyleSheet, View, TouchableWithoutFeedback, FlatList} from "react-native";
import { vs, ms, hs } from "../global/responsiveScaling";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useMemo, useState, memo, useCallback} from "react";
import Post from "../post/post";

const envVariables = require('../../../envVariables.json');

 // this prevents rerender of flatlist when props dont change. need custom comparison since objects arent compared properly by default
const MemoFlatList = memo(FlatList, (oldProps, newProps) => { return JSON.stringify(newProps) === JSON.stringify(oldProps)})

// screen to view followers and following
export default function FollowPage(){
    const [dum, setDum] = useState(0)
    const [prePosts, setPrePosts] = useState([])
    
    useEffect(()=>{
        getPosts();
    }, [])

    useEffect(()=>{
        console.log("rerender from dum " + dum)
    })

    async function getPosts(){
        const thePosts = await fetch(envVariables.serverURL + "/post/getPosts");
        const data = await thePosts.json()
        setPrePosts(data.res)
    }
    
    
    const posts = useMemo(()=> {console.log("HIT MEMO POSTS"); return prePosts}, [prePosts])
    return(
        <View style = {styles.container}>
            <TouchableWithoutFeedback onPress={() => setDum(dum + 1)}><Ionicons style ={styles.postButton} name={"add-circle"} color={"orange"} size={ms(60)}></Ionicons></TouchableWithoutFeedback>
            <MemoFlatList 
                style={{width:"100%"}}
                data={posts}
                keyExtractor={post=> post.post_id}
                ItemSeparatorComponent={() => <View style={{height: vs(30)}}></View>}
                ListFooterComponent={() => <View style={{height:vs(30)}}></View>}
                renderItem={({item}) => (
                    <View style={{alignItems:'center'}}>
                        <Post data={{fname: item.fname, lname:item.lname, uri: item.uri, caption: item.caption}} />
                    </View>   
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        width: "100%",
    },
    postButton:{
        position:"absolute",
        bottom: vs(20),
        right: ms(20),
        zIndex: 1
    }
})