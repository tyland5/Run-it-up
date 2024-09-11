import {StyleSheet, Text, View, Button, Image, TextInput, TouchableWithoutFeedback, Dimensions, Keyboard, ScrollView, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useKeyboardHeight from 'react-native-use-keyboard-height';
import { useEffect, useRef, useState, useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { hs, vs, ms } from '../global/responsiveScaling';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyledButton, StyledText } from '../global/styledComponents';
import { AuthContext } from '../login/authContext';

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
    const bottomTabBarHeight = useBottomTabBarHeight(); 
    const {loggedIn, setLoggedIn, selfUid, csrfToken} = useContext(AuthContext);

    useEffect(() => {

        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setKeyboardShown(true);
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setKeyboardShown(false);
          }
        );

        return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
        };
      }, []);

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
            const dateTime = Date.now()
            data.append("media", {
                name: `${selfUid}${dateTime}${i}.${extension}`, // TODO: make sure to prepend uid here later on
                type: info.type,
                uri: Platform.OS === "android" ? info.uri : info.uri.replace("file://", "")
            })
        }
       
        const response = await fetch(envVariables.serverURL +"/post/makePost", {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              "X-CSRF-Token": csrfToken
            },
            body: data
        })

        if(response.status === 401){
            setLoggedIn(false)
            return
        }
        else if(response.status === 500){
            return
        }

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
                    <Ionicons name="close" size = {ms(30)} color ={"white"} />
                </TouchableWithoutFeedback>
                <StyledButton small onPress={createPost}>
                    <StyledText bold>Post</StyledText>
                </StyledButton>
            </View>
            

            <View style ={keyboardShown? {height:screenHeight - keyboardHeight - vs(60) - vs(90)} :  {height:screenHeight- vs(60) - bottomTabBarHeight - vs(90)}}>
                <ScrollView keyboardShouldPersistTaps={'always'} keyboardDismissMode={'on-drag'}>   
                    <TextInput style={styles.postCaptionInput} 
                    multiline= {true} placeholder="Let Em Know..." placeholderTextColor={"gray"} 
                    scrollEnabled={false} onChangeText={(caption) => setCaption(caption)}></TextInput> 

                    {uploadedMedia.length != 0 && 
                    <>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("MediaGallery" , {media: uploadedMedia, index: 0})}>
                            <Image resizeMode={"cover"} style={{ width:"100%", height: thumbnailHeight, marginRight: hs(10), marginTop: vs(20)}} source={{uri:uploadedMedia[0]}}/>
                        </TouchableWithoutFeedback>
                        <StyledText bold>{uploadedMedia.length} file(s) chosen</StyledText>
                    </>}
                </ScrollView>
            </View>

            <View style={styles.attachmentsContainer}>
                <TouchableWithoutFeedback onPress={openCamera}>
                    <Ionicons name="camera-outline" size = {ms(30)} color ={"white"} />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={openCameraRoll}>
                    <Ionicons name="image-outline" size = {ms(30)} color ={"white"} />
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
        fontSize: ms(18),
        color: 'white',
        marginLeft: hs(10),
    },
    closeContainer:{
        position: 'absolute',
        top: vs(40),
        left: hs(10),
    },
    topSection:{
        height: vs(90),
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems: "flex-end",
        paddingBottom: vs(15),
        paddingLeft:hs(10),
        paddingRight: hs(15),
    },
    attachmentsContainer:{
        zIndex: 1,
        height: vs(60),
        flexDirection: "row",
        alignItems: "center",
        paddingLeft:hs(10),
        gap:hs(15),
        borderTopWidth:vs(2),
        borderTopColor: "white",
    },
})