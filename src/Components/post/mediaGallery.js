import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import Gallery from 'react-native-awesome-gallery';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { ms, hs, vs } from '../global/responsiveScaling';


export default function MediaGallery({route}){
    const navigation = useNavigation();
    const swipeCloseEnabled = useRef(true);
    const [showClose, setShowClose] = useState(true)

    const images = route.params.media

    return (
        <>
            <TouchableWithoutFeedback onPress={() => setShowClose(!showClose)}>
                <View style= {styles.container}>

                    {showClose && 
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                        <Ionicons style ={styles.closeContainer} name="close" size = {ms(35)} color ={"white"} />
                    </TouchableWithoutFeedback> }

                    <Gallery
                    data={images}
                    initialIndex={route.params.index}
                    disableTransitionOnScaledImage = {true}
                    disableVerticalSwipe = {true}
                    onIndexChange={(newIndex) => {
                        // technically could show play button here for vid?
                        // wrong, do it on render item
                    }}
                    />
                </View>
            </TouchableWithoutFeedback>
        </>
      );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex: 1,
        position:'relative'
    },
    closeContainer:{
        position:'absolute',
        top: vs(60),
        left: hs(10),
        zIndex: 1
    }
})