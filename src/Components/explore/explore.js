import { useEffect, useState, useContext, memo } from "react";
import { StyledText, StyledButton } from "../global/styledComponents";
import { View, StyleSheet, Platform, TouchableWithoutFeedback, Pressable, Dimensions, Image } from "react-native";
import MapView, {Marker, Callout} from 'react-native-maps';
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import { hs, vs, ms } from "../global/responsiveScaling";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../login/authContext";
import * as Location from 'expo-location';

const envVariables = require('../../../envVariables.json');

function CustomCalloutView({info}){
    const navigation = useNavigation()

    useEffect(()=>{
        //console.log(props) // literally get all props passed into markers component
    },[])

    return(
        <View style={styles.calloutContainer}>
            <View style={{flexDirection:'row', gap:hs(10)}}>
                <TouchableWithoutFeedback onPress={() => navigation.push('Profile', {uid:info.uid})}>
                    <Image style={{width: hs(40), height: vs(40), borderRadius: hs(40)}} source={{uri:info.pfp}} />
                </TouchableWithoutFeedback>
                
                <TouchableWithoutFeedback onPress={() => navigation.push('Profile', {uid:info.uid})}>
                <View>
                    <StyledText bold>{info.name}</StyledText>
                    <StyledText>@{info.username}</StyledText>
                </View>
                </TouchableWithoutFeedback>
            </View> 

            <StyledText>Event: {info.title}</StyledText>
            <StyledText>Sport: {info.sport}</StyledText>

            <StyledButton onPress={() => navigation.navigate("EventDetails",{info:info})}>
                <StyledText small>View More</StyledText>
            </StyledButton>
        </View>
    )
}


// necessary since markers.map rerenders for whatever reason
// only rerender the marker if its active value changes (for color change)
const CustomMarker = memo(function CustomMarker({marker, index, active, handleMarkerPress, setActiveId}){
    return (
        <Marker
            key={`${marker.event_id}-${active? 'active' : 'inactive'}`}
            pinColor={active? 'green' : 'red'}
            coordinate={{longitude: Number(marker.longitude), latitude: Number(marker.latitude)}}
            onSelect={() => {handleMarkerPress(marker, index); setActiveId(marker.event_id)}}
        />
    )
}, (prevProps, nextProps) => {return prevProps.active === nextProps.active})



export default function Explore({route}){
    const [allowNewMarker, setAllowNewMarker] = useState(false)
    const [markers, setMarkers] = useState([])
    const [deletedMarkers, setDeletedMarkers] = useState([]) // ids of the deleted in here
    const [showMap, setShowMap] = useState(false)
    const navigation = useNavigation()
    const {setLoggedIn} = useContext(AuthContext)
    const [showCallout, setShowCallout] = useState(false)
    const [markerInfo, setMarkerInfo] = useState({})
    const [activeId, setActiveId] = useState(0)
    const [userLocation, setUserLocation] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        showMap: false
    })

    useEffect(()=>{
        getUserLocation()
        getEvents()
    },[])

    useEffect(()=>{
        // undefined if not from make event
        // deleting event marker
        if(route.params?.delete_id){
            setDeletedMarkers([...deletedMarkers, route.params.delete_id])
        }
        // creating event marker
        else if(route.params){
            setMarkers([...markers, route.params])
        }
    },[route.params])

    
  
    // specifically for intial region. Note: Changing [initial region] after the component has mounted will not result in a region change.
    // thats why we render the map only when we have the definitive initial region
    async function getUserLocation(){
        const { status } = await Location.requestForegroundPermissionsAsync();
        if(status === "granted"){
            const location = await Location.getCurrentPositionAsync({});
            const coordinate = location.coords
            setUserLocation({...userLocation, latitude:coordinate.latitude, longitude:coordinate.longitude, showMap : true});
        }
    }

    async function getEvents(){
        const response = await fetch(envVariables.serverURL + "/event/getEvents");
        
        if(response.status === 200){
            const respJson = await response.json()
            setMarkers(respJson.res)
        }
        else if(response.status === 401){
            setLoggedIn(false)
        }
    }

    // possibly create new marker. 
    function createNewMarker(result){
        setAllowNewMarker(false)
        const latLong = result.nativeEvent.coordinate
        navigation.navigate("MakeEvent", {coordinate: latLong})
    }

    function handleMarkerPress(info, index){
        setMarkerInfo(info)
        setShowCallout(true)
    }

    return(
        <View style={styles.container}>

            {/* android map not in dark mode since uiStyle prop only works for ios. need to figure out solution*/}
            {userLocation.showMap && <MapView style={styles.map} userInterfaceStyle='dark'
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                initialRegion={userLocation}
                showsUserLocation={true}
                onPress={(result) => {
                    // since on deselect is glitchy
                    if(activeId !== 0){
                        setActiveId(0);
                        setShowCallout(false)
                    }
                    else if(allowNewMarker){
                        createNewMarker(result)
                    } 
                    console.log("on press registered")
                }}
            >

                {markers.map((marker, index) => {
                    // if i delete or add to markers, memoized components wont be rerendered
                    if (deletedMarkers.includes(marker.event_id)){
                        return (<></>)
                    } 
                    return (<CustomMarker key={marker.event_id} marker={marker} index={marker.event_id} active={activeId === marker.event_id} 
                        handleMarkerPress={handleMarkerPress} setActiveId={setActiveId}/>)
                })}
  
            </MapView>}

            <TouchableWithoutFeedback onPress={() => {setAllowNewMarker(!allowNewMarker)}}>
                <Ionicons style ={styles.addMarkerButton} name={allowNewMarker? "close-circle": "add-circle"} color={"orange"} size={ms(60)}></Ionicons>
            </TouchableWithoutFeedback>
            
            {showCallout && <CustomCalloutView info={markerInfo}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: "100%",
        height: '100%',
        margin:0,
        padding:0
    },
    map: {
        width: '100%',
        height: '100%',
    },
    addMarkerButton:{
        position:"absolute",
        bottom: vs(40),
        right: ms(20),
        zIndex:2
    },
    calloutContainer:{
        position:'absolute', 
        bottom:0, 
        height:vs(200), 
        width: '100%', 
        gap: vs(15), 
        paddingVertical: vs(15),
        paddingHorizontal: hs(10), 
        backgroundColor:"#121212",
        zIndex:2
    }
})