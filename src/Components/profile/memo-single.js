import { StyleSheet, View, TouchableWithoutFeedback} from "react-native";
import { vs, ms, hs } from "../global/responsiveScaling";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useMemo, useState, memo} from "react";
import Post from "../post/post";

// screen to view followers and following
export default function FollowPage(){
    const [dum, setDum] = useState(0)
    
    useEffect(()=>{
        console.log("rerender from dum " + dum)
    })

    // not including this causes Post to get rerendered since data would get re-initialized
    const data = useMemo(() => {return {fname: "test", lname:"user", uri: "", caption: "testing this shitty memo"}}, [])
    return(
        <View style = {styles.container}>
            <TouchableWithoutFeedback onPress={() => setDum(dum + 1)}><Ionicons style ={styles.postButton} name={"add-circle"} color={"orange"} size={ms(60)}></Ionicons></TouchableWithoutFeedback>
            <Post data={data}/>
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
        right: ms(20)
    }
})