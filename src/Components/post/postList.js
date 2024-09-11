import React, { memo, useCallback, useState, useEffect, useMemo, useContext} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { likePost, unlikePost } from './likedPostsStore'
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { vs, hs, ms } from '../global/responsiveScaling';
import { AuthContext } from '../login/authContext';
import Post from './post';

const envVariables = require('../../../envVariables.json');

export default function PostList({onScroll = ()=>{}, filters = {}, refreshEnabled = false}){
    const [prePosts, setPrePosts] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const {setLoggedIn} = useContext(AuthContext)
    const dispatch = useDispatch()

    useEffect(()=>{
        console.log("rendering from posts list")
        getPosts();
    }, [])

    useEffect(() =>{
        console.log("rerendering from posts list")
    })
    
    // used to refresh the post feed
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getPosts();
            setRefreshing(false);
        }, 1500);
    }, []);

    async function getPosts(){
        const thePosts = await fetch(envVariables.serverURL + "/post/getPosts?" + new URLSearchParams(filters));
        
        if(thePosts.status === 401){
            setLoggedIn(false)
            return
        }
        else if(thePosts.status === 500){
            return
        }

        const data = await thePosts.json()
        const fetchedPosts = data.res
        setPrePosts(fetchedPosts)

        for(let i = 0; i < fetchedPosts.length; i ++){
            if(fetchedPosts[i].liked){
                dispatch(likePost([fetchedPosts[i]['post_id'], fetchedPosts[i].likes]))
            }
        }
    }
    
    const posts = useMemo(()=> {return prePosts}, [prePosts])
    return(
        <View style = {styles.container}>
            <FlatList 
                style={{width:"100%"}}
                data={posts}
                refreshControl={refreshEnabled ? 
                    <RefreshControl
                    colors={["#FFFFFF"]}
                    tintColor={"#FFFFFF"}
                    refreshing={refreshing}
                    onRefresh={onRefresh} /> 
                    : null}
                keyExtractor={useCallback(post=> post.post_id, [])}
                onScroll={onScroll}
                renderItem={useCallback(({item}) => (
                    <View style={{alignItems:'center'}}>
                        <Post data={{uid:item.uid, postId:item['post_id'], likeCount: item.likes, liked: item.liked, commentCount: item.comments, name: item.name, uri: item.uri, caption: item.caption, pfp:item.pfp}} />
                    </View>   
                ), [posts])}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#121212", 
        flex: 1, 
        width: "100%"
    },

})