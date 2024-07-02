import { useNavigation } from '@react-navigation/native';
import {StyleSheet, Text, View, Button, Image, Dimensions, FlatList, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Post({data}){

    const navigation = useNavigation();

    function getUris(posts){
        /*
        const uriList = []
        console.log(data)
        console.log(posts)
        for(let i = 0; i < posts.length; i++){
            console.log('hello')
            uriList.push(posts[i].uri)
        }

        console.log(uriList)
        return uriList
        */
    }

    return(
        <View style={styles.container}>
            <View style={styles.top_section}>
                <Image style={styles.pfp} source={{uri: "https://b.fssta.com/uploads/application/nba/headshots/2374.vresize.350.350.medium.84.png"}}/>
                <Text style={styles.poster}>{data.fname} {data.lname}</Text>
            </View>

            <FlatList
                data={[{dummy: "hello"}, {dummy:"Hello2"}]}
                horizontal={true}
                renderItem={({item, index})=>(
                    <TouchableWithoutFeedback onPress={() => navigation.navigate("MediaGallery" , {media: data, index: index})}>
                        <Image style={{ backgroundColor: 'white', width:Dimensions.get('screen').width * .9 * .9, height: 300, marginRight:10}} source={require('./knicks.png')}/>
                    </TouchableWithoutFeedback>
                )}
                showsHorizontalScrollIndicator={false}
            />

            <View style={styles.caption}>
                <Text style={styles.text}>I'm just that guy. Probably the goat</Text>
            </View>

            <View style={styles.activityBar}>
                <Ionicons name="heart-outline" size = {25} color ={"white"} />
                <Ionicons name="chatbubble-outline" size = {25} color ={"white"} />
                <Ionicons name="arrow-redo-outline" size = {25} color ={"white"} />
                <Ionicons name="bookmark-outline" size = {25} color ={"white"} />
            </View>
        </View>)
}

const styles = StyleSheet.create({
    container:{
        width: "90%",
        
    }, 
    top_section:{
        flexDirection: "row",
        alignItems: 'center',
        padding: 5,
        
    },
    poster:{
        fontSize:16,
        color:"white",
        fontWeight: 'bold'
    },
    pfp:{
        width: 40,
        height: 40,
        borderRadius:20,
        borderWidth: 1,
        marginRight: 5
    },
    media:{
        marginBottom: 10,
        flexDirection: "row",
        gap: 10,
        overflow:'hidden'
    },
    text:{
        fontSize:16,
        color:"white"
    },
    caption:{
        marginBottom: 10
    },
    activityBar:{
        flexDirection:'row',
        justifyContent: 'space-evenly'
    }
})