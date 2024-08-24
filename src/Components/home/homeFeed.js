import React, { useState, useContext, useEffect } from 'react';
import {StyleSheet, Text, View, Button, FlatList, TouchableWithoutFeedback, Image,Dimensions, RefreshControl} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../login/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Post from '../post/post';
import { hs, vs, ms } from '../global/responsiveScaling';

const envVariables = require('../../../envVariables.json');

export default function HomeFeed(){
    const {loggedIn, setLoggedIn} = useContext(AuthContext);
    const [posts, setPosts] = useState(null)
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(()=>{
        getPosts()
    }, [])

    // used to refresh the home feed
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getPosts();
            setRefreshing(false);
        }, 1500);
    }, []);
    
    async function getPosts(){
        const thePosts = await fetch(envVariables.serverURL + "/post/getPosts");
        const data = await thePosts.json()
        setPosts(data.res)
    }


    return(
        <View style={styles.container}>
            {/* 
            <Text style={{fontSize:30, color:"white"}}>Home screen</Text>
            <Button title='SIGN OUT' onPress={() => setLoggedIn(false)}></Button>
            <Button title='Expand Post' onPress={() => navigation.navigate("ExpandedPost")}></Button>
            */}
            <FlatList 
                style={{width:"100%",}}
                data={posts}
                keyExtractor={post=> post.post_id}
                ItemSeparatorComponent={() => <View style={{height: vs(30)}}></View>}
                refreshControl={<RefreshControl
                    colors={["#FFFFFF"]}
                    tintColor={"#FFFFFF"}
                    refreshing={refreshing}
                    onRefresh={onRefresh} />}
                ListFooterComponent={<View style={{height:vs(30)}}></View>}
                
                renderItem={({item}) => (
                    <View style={{alignItems:'center'}}>
                        <Post data={{uid: item.uid, name: item.name, uri: item.uri, caption: item.caption}}>{/* All images would be passed in through here*/}</Post>
                    </View>   
                )}
            />
            <TouchableWithoutFeedback onPress={() => navigation.navigate("MakePost")}><Ionicons style ={styles.postButton} name={"add-circle"} color={"orange"} size={ms(60)}></Ionicons></TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        alignItems:'center',
        width: "100%",
    },
    postButton:{
        position:"absolute",
        bottom: vs(20),
        right: ms(20)
    }
})