import {StyleSheet, Text, View, Button, Image, TextInput, TouchableWithoutFeedback,KeyboardAvoidingView, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function MakePost({media}){
    const navigation = useNavigation()

    return(
    <View style={styles.container}>

        <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
            <Ionicons style ={styles.closeContainer} name="close" size = {30} color ={"white"} />
        </TouchableWithoutFeedback>

        <TextInput style ={styles.postCaptionInput} multiline= {true} placeholder='Let Em Know...' placeholderTextColor={"gray"}></TextInput>
        <View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
            </KeyboardAvoidingView>
            <View style={styles.attachmentsContainer}></View>

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
        height:"80%",
        fontSize: 18,
        color: 'white',
        marginLeft: 10,
        marginTop: 90,
    },
    closeContainer:{
        position: 'absolute',
        top:40,
        left: 10
    },
    attachmentsContainer:{
        zIndex: 1,
        backgroundColor: "red", 
        height: 80,
        position:"sticky"
    }

})