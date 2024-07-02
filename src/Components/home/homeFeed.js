import React, { useState, useContext, useEffect } from 'react';
import {StyleSheet, Text, View, Button, FlatList, TouchableWithoutFeedback} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../login/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Post from '../post/post';

const envVariables = require('../../../envVariables.json');

export default function HomeFeed(){
    const [loggedIn, setLoggedIn] = useContext(AuthContext);
    const [posts, setPosts] = useState([{fname:"placeholder", lname:"placeholder2"}])
    const navigation = useNavigation();
    
    useEffect(()=>{
        setPosts([{post_id: 1, fname:"Josh", lname:"Hart"}, {post_id:2, fname: "Jalen", lname: "Brunson"}])
        console.log(posts)
    }, [])


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
                ItemSeparatorComponent={() => <View style={{height:30}}></View>}
                renderItem={({item}) => (
                    <View style={{alignItems:'center'}}>
                        <Post data={{fname: item.fname, lname:item.lname, uri: ""}}>{/* All images would be passed in through here*/}</Post>
                    </View>   
                )}
            />
            <TouchableWithoutFeedback onPress={() => navigation.navigate("MakePost")}><Ionicons style ={styles.postButton} name={"add-circle"} color={"orange"} size={60}></Ionicons></TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
        alignItems:'center',
        width: "100%"
    },
    postButton:{
        position:"absolute",
        bottom: 20,
        right: 20
    }
})