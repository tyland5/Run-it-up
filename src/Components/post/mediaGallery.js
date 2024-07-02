import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import Gallery from 'react-native-awesome-gallery';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';


export default function MediaGallery({route}){
    const navigation = useNavigation();
    const swipeCloseEnabled = useRef(true);
    const [showClose, setShowClose] = useState(true)

    const images = ["https://cdn.vox-cdn.com/thumbor/iFL_PO_PmxYFDTog-WO2jrtYZk8=/0x0:3000x2000/1200x800/filters:focal(1260x760:1740x1240)/cdn.vox-cdn.com/uploads/chorus_image/image/73428720/KnicksAddMoreNova_Getty_Ringer.0.jpg",
        "https://nypost.com/wp-content/uploads/sites/2/2024/05/041224Knicks104CW-1.jpg"
    ]

    return (
        <>
            <TouchableWithoutFeedback onPress={() => setShowClose(!showClose)}>
                <View style= {styles.container}>

                    {showClose && 
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                        <Ionicons style ={styles.closeContainer} name="close" size = {35} color ={"white"} />
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
        top: 60,
        left: 10,
        zIndex: 1
    }
})