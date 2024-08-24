import { StyledButton, StyledText } from "../global/styledComponents";
import { View, StyleSheet, Image, Dimensions, FlatList, ScrollView, TouchableWithoutFeedback } from "react-native";
import React, { useState, useContext, useEffect, memo, useMemo, useCallback } from 'react';
import { hs, vs, ms } from "../global/responsiveScaling";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Post from "../post/post";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const envVariables = require('../../../envVariables.json');

// this prevents rerender of flatlist when props dont change. need custom comparison since objects arent compared properly by default
//const MemoTabView = memo(TabView, (oldProps, newProps) => { console.log(oldProps); console.log(newProps); return newProps.navigationState.renderScene == oldProps.navigationState.renderScene})

const MemoFlatList = memo(FlatList, (oldProps, newProps) => {return JSON.stringify(newProps) === JSON.stringify(oldProps)})
function PostsTab({onScroll}){
    const [prePosts, setPrePosts] = useState([])
    
    useEffect(()=>{
        getPosts();
    }, [])

    async function getPosts(){
        const thePosts = await fetch(envVariables.serverURL + "/post/getPosts");
        const data = await thePosts.json()
        setPrePosts(data.res)
    }
    
    
    const posts = useMemo(()=> {return prePosts}, [prePosts])
    return(
        <View style = {styles.container}>
            <MemoFlatList 
                style={{width:"100%"}}
                data={posts}
                keyExtractor={post=> post.post_id}
                ItemSeparatorComponent={() => <View style={{height: vs(30)}}></View>}
                ListFooterComponent={() => <View style={{height:vs(30)}}></View>}
                onScroll={onScroll}
                renderItem={({item}) => (
                    <View style={{alignItems:'center'}}>
                        <Post data={{name: item.name, uri: item.uri, caption: item.caption}} />
                    </View>   
                )}
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
    const navigation = useNavigation();

    // trying to prevent react native tab from rerendering on when changin state (following button)
    const routes = React.useMemo( () => [
      { key: 'Posts', title: 'Posts' },
      { key: 'Activity', title: 'Activity' },
    ], []);
    const index = React.useMemo( () => 0, []);

    useEffect(() =>{
        getProfileInfo();
    }, [])

    useEffect(()=>{
        console.log("rerendering")
    }
    )

    const getProfileInfo = async () =>{
        const res = await fetch(envVariables.serverURL + "/user/getUserInfo?" + new URLSearchParams({uid: route.params.uid}));
        const jsonRes = await res.json();
        const uid = await AsyncStorage.getItem('uid')
        
        if(parseInt(uid) === route.params.uid){
            setIsSelf(true)
        }

        setProfileInfo(jsonRes.res[0])
    }

    const MemoTabsView = () => <PostsTab onScroll={(event) => {
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

    return(
    <View style={styles.container}>

        {showHeader && 
        <>
        <View style={styles.topSection}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("MediaGallery" , {media: [""], index: 0})}>
            <Image style={[styles.pfp, {borderRadius:pfpBorderRadius, height:pfpBorderRadius}]} source={require("./pfp-test.png")}/>
            </TouchableWithoutFeedback>
            <View style={styles.identification}>
                <StyledText bold>{profileInfo.name}</StyledText>
                <StyledText>@{profileInfo.username}</StyledText>
                <View style={{height:vs(10)}}></View>

                {isSelf ? 
                    <StyledButton bgColor="gray" borderWidth={ms(2)} onPress={() => {}}>
                        <StyledText bold>Edit Profile</StyledText>
                    </StyledButton> 
                    :
                    <>
                    {isFollowing ? 
                    <StyledButton bgColor="black" borderWidth={ms(2)} onPress={() => setIsFollowing(false)}>
                        <StyledText bold>Following</StyledText>
                    </StyledButton>
                    :
                    <StyledButton onPress={() => setIsFollowing(true)}>
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
            <TouchableWithoutFeedback onPress={() => navigation.navigate("FollowPage", {activeRouteIndex: 0})}>
                <StyledText small>727 Followers</StyledText>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => navigation.navigate("FollowPage", {activeRouteIndex: 1})}>
                <StyledText small>727 Following</StyledText>
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
        onIndexChange={() => {return}}
        renderScene={SceneMap({
            Posts: useCallback(() => MemoTabsView(), []),
            Activity: useCallback(() => MemoTabsView(), []),
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
        gap: hs(5),
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