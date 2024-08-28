import { StyledButton, StyledText } from "../global/styledComponents";
import { View, StyleSheet, Image, Dimensions, FlatList, ScrollView, TouchableWithoutFeedback } from "react-native";
import React, { useState, useContext, useEffect, memo, useMemo, useCallback } from 'react';
import { hs, vs, ms } from "../global/responsiveScaling";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Post from "../post/post";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../login/authContext";

const envVariables = require('../../../envVariables.json');

// this prevents rerender of flatlist when props dont change. need custom comparison since objects arent compared properly by default
//const MemoTabView = memo(TabView, (oldProps, newProps) => { console.log(oldProps); console.log(newProps); return newProps.navigationState.renderScene == oldProps.navigationState.renderScene})

const MemoFlatList = memo(FlatList, (oldProps, newProps) => { return JSON.stringify(newProps) === JSON.stringify(oldProps)})
function PostsTab({onScroll, uid}){
    const [prePosts, setPrePosts] = useState([])
    
    useEffect(()=>{
        getPosts();
    }, [])

    useEffect(() =>{
        console.log("rerendering from posts tab")
    })

    async function getPosts(){
        const thePosts = await fetch(envVariables.serverURL + "/post/getPosts?" + new URLSearchParams({uid: uid }));
        const data = await thePosts.json()
        setPrePosts(data.res)
    }
    
    
    const posts = useMemo(()=> {return prePosts}, [prePosts])
    return(
        <View style = {[styles.container, {marginTop: vs(10)}]}>
            <MemoFlatList 
                style={{width:"100%"}}
                data={posts}
                keyExtractor={useCallback(post=> post.post_id, [])}
                ItemSeparatorComponent={useCallback(() => <View style={{height: vs(30)}}></View>,[])}
                ListFooterComponent={useCallback(() => <View style={{height:vs(30)}}></View>, [])}
                onScroll={onScroll}
                renderItem={useCallback(({item}) => (
                    <View style={{alignItems:'center'}}>
                        <Post data={{name: item.name, uri: item.uri, caption: item.caption, pfp:item.pfp}} />
                    </View>   
                ), [posts])}
            />
        </View>
    )
}

export default function Profile({route}){
    const pfpBorderRadius = Dimensions.get('window').width * .3 // decimal based on pfp width percentage
    const [isFollowing, setIsFollowing] = useState(false)
    const [showHeader, setShowHeader] = useState(true);
    const [profileInfo, setProfileInfo] = useState({});
    const [isSelf, setIsSelf] = useState(false)
    const {selfUid, csrfToken} = useContext(AuthContext)
    const navigation = useNavigation();

    // trying to prevent react native tab from rerendering on when changin state (following button)
    const routes = React.useMemo( () => [
      { key: 'Posts', title: 'Posts' },
      { key: 'Activity', title: 'Activity' },
    ], []);
    const index = React.useMemo( () => 0, []);

    useEffect(() =>{
        const unsubscribe = navigation.addListener('focus', () => {
            // do something
            getProfileInfo();
            console.log("rendering for first time")
          });
      
        return unsubscribe;
    }, [])

    useEffect(()=>{
        console.log("rerendering")
    }
    )

    const getProfileInfo = async () =>{
        const res = await fetch(envVariables.serverURL + "/user/getUserInfo?" + new URLSearchParams({uid: route.params.uid}));
        const jsonRes = await res.json();
        
        if(selfUid === route.params.uid){
            setIsSelf(true)
        }
        else{
            setIsFollowing(jsonRes.res[0].isFollowing)
        }

        setProfileInfo(jsonRes.res[0])
    }

    const MemoTabsView = () => <PostsTab uid = {route.params.uid} onScroll={(event) => {
        if(event.nativeEvent.contentOffset.y > 0){
            setShowHeader(false)
        }
        else if(event.nativeEvent.contentOffset.y <= 0){
            setShowHeader(true)
        }
    }}/>

    const renderTabBar = props =>(
        <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'white' }}
        style={{ backgroundColor: "#121212" }}
        />
    )

    const followUser = async() =>{

        const res = await fetch(envVariables.serverURL +"/user/followUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
               Accept : "application/json",
              "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify({followingId: route.params.uid})
        })

        if(res.status === 200){
            setIsFollowing(true)
        }
    }

    const unfollowUser = async() =>{
        const res = await fetch(envVariables.serverURL +"/user/unfollowUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
               Accept : "application/json",
              "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify({followingId: route.params.uid})
        })

        if(res.status === 200){
            setIsFollowing(false)
        }
    }

    return(
    <View style={styles.container}>

        {showHeader && 
        <>
        <View style={styles.topSection}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("MediaGallery" , {media: [profileInfo.pfp], index: 0})}>
            <Image style={[styles.pfp, {borderRadius:pfpBorderRadius, height:pfpBorderRadius}]} source={{uri: profileInfo.pfp}}/>
            </TouchableWithoutFeedback>
            <View style={styles.identification}>
                <StyledText bold>{profileInfo.name}</StyledText>
                <StyledText>@{profileInfo.username}</StyledText>
                <View style={{height:vs(10)}}></View>

                {isSelf ? 
                    <StyledButton bgColor="#3b3b3b" borderWidth={ms(2)} onPress={() => {navigation.navigate("EditProfile", 
                        {pfp: profileInfo.pfp, name: profileInfo.name, username: profileInfo.username, bio: profileInfo.bio, uid: profileInfo.uid})}}>
                        <StyledText bold>Edit Profile</StyledText>
                    </StyledButton> 
                    :
                    <>
                    {isFollowing ? 
                    <StyledButton bgColor="black" borderWidth={ms(2)} onPress={() => unfollowUser()}>
                        <StyledText bold>Following</StyledText>
                    </StyledButton>
                    :
                    <StyledButton onPress={() => followUser()}>
                        <StyledText bold>Follow</StyledText>
                    </StyledButton>}
                    </>
                }   

            </View>
        </View>

        <View style={{paddingHorizontal: hs(5)}}>
            <StyledText
            onTextLayout = {(event) =>{
            }}
            numberOfLines={3}>{profileInfo.bio}</StyledText>
        </View>
        
        <View style={styles.followMetrics}>
            <TouchableWithoutFeedback onPress={() => navigation.push("FollowPage", {activeRouteIndex: 0, uid:route.params.uid})}>
                <StyledText small>{profileInfo.followers} Followers</StyledText>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => navigation.push("FollowPage", {activeRouteIndex: 1, uid:route.params.uid})}>
                <StyledText small>{profileInfo.following} Following</StyledText>
            </TouchableWithoutFeedback>
        </View>
        </>
        }

        {/* Beginning of section not header*/}

        {/* TO DO: MAKE SURE TO ENABLE LAZY RENDERING FOR THESE TAB VIEWS. CAN DO WITH PROP FOR TABVIEW*/}
         {/* empty function in onIndexChange prevents rerender when switching tabs */}
         {/* Each tab is responsible for memoization. Tabview covers this with renderScene SceneMap*/}
        <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        onIndexChange={useCallback(() => {return}, [])}
        renderScene={SceneMap({
            Posts: useCallback(() => MemoTabsView(), []),
            Activity: useCallback(() => {return <></>}, []),
          })}
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
    topSection:{
        paddingTop: vs(20),
        flexDirection:"row",
        alignItems:"center",
        gap: hs(10),
        marginBottom: vs(20),
        paddingHorizontal: hs(5)
    },
    pfp:{
        width: "30%"
    },
    followMetrics:{
        flexDirection:"row",
        gap: hs(10),
        marginTop:vs(10),
        marginBottom: vs(15),
        paddingHorizontal: hs(5)
    }

})