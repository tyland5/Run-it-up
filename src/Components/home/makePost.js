import {StyleSheet, Text, View, Button, Image, TextInput, TouchableWithoutFeedback, Dimensions, Keyboard, ScrollView, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import { useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
const envVariables = require('../../../envVariables.json');

export default function MakePost({media}){
    const navigation = useNavigation()
    const keyboardHeight = useKeyboardHeight();
    const [keyboardShown, setKeyboardShown ]= useState(false);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const [uploadedMedia, setUploadedMedia] = useState([])
    const [uploadedMediaObj, setUploadedMediaObj] = useState([])
    const [thumbnailHeight, setThumbnailHeight] = useState(0)
    const [caption, setCaption] = useState('');

    async function createPost(){
        if(caption === "" || caption === "" && uploadedMedia.length === 0){
            return
        }

        const data = new FormData();
        data.append("content",  caption)

        // file name is uid + datetime for uniqueness
        for(let i =0; i < uploadedMediaObj.length; i++){
            const info = uploadedMediaObj[i]
            const extension = info.mimeType.split("/")[1]
            data.append("media", {
                name: `${Date.now()}.${extension}`, // TODO: make sure to prepend uid here later on
                type: info.type,
                uri: Platform.OS === "android" ? info.uri : info.uri.replace("file://", "")
            })
        }

        const response = await fetch(envVariables.serverURL +"/post/makePost", {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data"
            },
            body: data
        })

        navigation.goBack();
    }

    async function openCameraRoll(){

        await ImagePicker.requestMediaLibraryPermissionsAsync() // this only asks if there are no access privileges

        const result = await ImagePicker.launchImageLibraryAsync({allowsMultipleSelection:true, selectionLimit:5})

        if(!result.canceled){
            setUploadedMedia(result.assets.map((image) => image.uri))
            setUploadedMediaObj(result.assets)
            
            const relativeHeight = result.assets[0].height / result.assets[0].width
            setThumbnailHeight(Math.min(screenHeight * .5, screenWidth * relativeHeight))
        }
    }

    async function openCamera(){

        await ImagePicker.requestCameraPermissionsAsync() 

        const result = await ImagePicker.launchCameraAsync()

        if(!result.canceled){
            await MediaLibrary.saveToLibraryAsync(result.assets[0].uri) // save image to camera roll

            setUploadedMedia([result.assets[0].uri])
            setUploadedMediaObj(result.assets)

            const relativeHeight = result.assets[0].height / result.assets[0].width
            setThumbnailHeight(Math.min(screenHeight * .5, screenWidth * relativeHeight))
        }
    }

    return(
    
        <View style={styles.container}>
    
            <View style = {styles.topSection}>
                <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                    <Ionicons name="close" size = {30} color ={"white"} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={createPost}>
                    <Text style={styles.postBtn}>Post</Text>
                </TouchableWithoutFeedback>
            </View>
            

            <View style ={keyboardShown? {height:screenHeight - keyboardHeight - 60 - 90} :  {height:screenHeight- 140 - 90}}>
                <ScrollView keyboardShouldPersistTaps={'always'} keyboardDismissMode={'on-drag'}>   
                    <TextInput style={styles.postCaptionInput} 
                    multiline= {true} placeholder="Let Em Know..." placeholderTextColor={"gray"} 
                    onFocus={() => {setKeyboardShown(true)}} onBlur={()=> {setKeyboardShown(false)}}
                    scrollEnabled={false} onChangeText={(caption) => setCaption(caption)}></TextInput> 

                    {uploadedMedia.length != 0 && 
                    <>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("MediaGallery" , {media: uploadedMedia, index: 0})}>
                            <Image resizeMode={"cover"} style={{ width:"100%", height: thumbnailHeight, marginRight:10, marginTop: 20}} source={{uri:uploadedMedia[0]}}/>
                        </TouchableWithoutFeedback>
                        <Text style={styles.mediaQty}>{uploadedMedia.length} files chosen</Text>
                    </>}
                </ScrollView>
            </View>

            <View style={styles.attachmentsContainer}>
                <TouchableWithoutFeedback onPress={openCamera}>
                    <Ionicons name="camera-outline" size = {30} color ={"white"} />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={openCameraRoll}>
                    <Ionicons name="image-outline" size = {30} color ={"white"} />
                </TouchableWithoutFeedback>
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
        
    },
    closeContainer:{
        position: 'absolute',
        top:40,
        left: 10,
    },
    topSection:{
        height:90,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems: "flex-end",
        paddingBottom: 15,
        paddingLeft:10,
        paddingRight: 15,
    },
    postBtn:{
        fontSize:18,
        color:"white"
    },
    attachmentsContainer:{
        zIndex: 1,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft:10,
        gap:15,
        borderTopWidth:2,
        borderTopColor: "white"
    },
    mediaQty:{
        fontSize: 18,
        color:"white",
        alignSelf:"flex-end"
    }

})