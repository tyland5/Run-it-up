import { useEffect, useRef } from 'react';
import {StyleSheet, Text, View, Button, Image, FlatList, Dimensions} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function MediaGallery({route}){
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const aspectRatio = 1

    // pinching
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1); // need this set up

    // panning
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);
    
    useEffect(()=>{
        /*
        Image.getSize(route.params.media, (width, height) =>{
            const aspectRatio2 = width / height
            console.log(aspectRatio)
            console.log(screenWidth/aspectRatio)
            aspectRatio = aspectRatio2
        })
            */

        console.log("Rerendered")
    },[])

    const handlePinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
        // force no permanent shrinking
        if(scale.value < 1){
            scale.value = 1
            savedScale.value = 1
        }

        savedScale.value = scale.value;
    });

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    const handlePan = Gesture.Pan()
    .minDistance(1)
    .maxPointers(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = screenWidth / 2 - 50;
      const maxTranslateY = screenHeight / 2 - 50;

      translationX.value = prevTranslationX.value + event.translationX,
      console.log("value " + translationX.value)
      console.log("absolute " + event.absoluteX)
      console.log("X " + event.x)
      
      translationY.value = prevTranslationY.value + event.translationY
    })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
      }));

    const animatedStylePan = useAnimatedStyle(() => ({
    transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
    ],
    }));

    return (
        <View style = {styles.container}>
            {/*
            <FlatList 
            data={[{},{}]}
            horizontal ={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) =>(
                
            )}
            />
            */}
            <GestureDetector gesture={handlePan}>
                <Animated.View style = {[{ height:"100%",justifyContent:"center", backgroundColor:'red'}, animatedStylePan]}>
                    <GestureDetector gesture={handlePinch}>
                        <Animated.Image style={[{width:screenWidth, height: 300}, animatedStyle]} source={require('./knicks.png')} />
                    </GestureDetector>
                </Animated.View>
            </GestureDetector>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:"column",
        width: "100%",
        justifyContent: "center",
        backgroundColor: "#121212"
    }
})