import {StyleSheet, Text, View, Button, Image, TextInput, TouchableWithoutFeedback, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import { useEffect, useState } from 'react';

export default function MakePost({media}){
    const navigation = useNavigation()
    const keyboardHeight = useKeyboardHeight();
    const [keyboardShown, setKeyboardShown ]= useState(false);
    const [screenHeight, setScreenHeight] = useState(0)

    useEffect(() =>{
        setScreenHeight(Dimensions.get('window').height)
    })

    return(
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
            <Ionicons style ={styles.closeContainer} name="close" size = {30} color ={"white"} />
        </TouchableWithoutFeedback>
      
        <TextInput style ={keyboardShown? [styles.postCaptionInput, {height:screenHeight - keyboardHeight - 60 - 90,}] : [styles.postCaptionInput, {height:screenHeight- 140 - 90}]} 
        multiline= {true} placeholder="Let Em Know..." placeholderTextColor={"gray"} 
        onFocus={() => {setKeyboardShown(true)}}></TextInput> 

        <View style={styles.attachmentsContainer}>
            
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#121212",
    },
    postCaptionInput:{
        fontSize: 18,
        color: 'white',
        marginLeft: 10,
        marginTop: 90,
        backgroundColor: "blue"
    },
    closeContainer:{
        position: 'absolute',
        top:40,
        left: 10,
        backgroundColor: "purple"
    },
    attachmentsContainer:{
        zIndex: 1,
        backgroundColor: "red", 
        height: 60
    }

})