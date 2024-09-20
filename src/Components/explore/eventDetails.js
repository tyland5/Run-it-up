import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../login/authContext";
import { View, StyleSheet, ScrollView, Linking, Platform, Dimensions, Image, Alert} from "react-native";
import { StyledButton, StyledText, StyledTextInput, StyledVertSpace } from "../global/styledComponents";
import { hs, vs, ms } from "../global/responsiveScaling";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { getDay, getMonth } from "../../functions/global";

const pfpDimensions = Dimensions.get('window').width * .15
const envVariables = require('../../../envVariables.json');

export default function EventDetails({route}){
    const [event, setEvent] = useState({}) //route.params.info
    const [numParticipants, setNumParticipants] = useState(0)
    const [isAttending, setIsAttending] = useState(false)
    const [eventDateTime, setEventDateTime] = useState(new Date(Date.now())) // need to make date obj for functions
    const {csrfToken, setLoggedIn, selfUid} = useContext(AuthContext)
    const navigation = useNavigation()

    useEffect(()=>{
        // https://stackoverflow.com/questions/22061999/how-should-i-store-data-for-events-in-different-timezones
        // https://stackoverflow.com/questions/19166995/java-calendar-date-and-time-management-for-a-multi-timezone-application/19170823#19170823
        // The parameter values are all evaluated against the local time zone, rather than UTC. Date.UTC() accepts similar parameters but interprets the components as UTC and returns a timestamp.
        
        // this might be useful to check if an event has past
        getEventDetails()
    }, [])

    // we should fetch everytime we visit page in case info changes or participant counter changes
    async function getEventDetails(){
        const res = await fetch(envVariables.serverURL + "/event/getEventDetails?" + new URLSearchParams({event_id: route.params.info.event_id}));

        if(res.status===200){
            const resJson = await res.json()
            const details = resJson.res
            const posterInfo = route.params.info
            details.pfp = posterInfo.pfp
            details.username = posterInfo.username
            details.name = posterInfo.name

            setEvent(details)
            setNumParticipants(details.participants)
            setEventDateTime(new Date(details.event_datetime))
            setIsAttending(details.isAttending)
        }
        else if (res.status===401){
            setLoggedIn(false)
        }
    }

    function openExternalMap(){
        const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${event.latitude}},${event.longitude}`;
        const label = event.title;
        const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
        });

            
        Linking.openURL(url);
    }

    const createDeletePostAlert = () =>
        Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', style:'destructive', onPress: () => deleteEvent()},
    ]);

    async function attendEvent(){
        const response = await fetch(envVariables.serverURL + "/event/attendEvent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept : "application/json",
                'x-csrf-token': csrfToken
            },
            body: JSON.stringify({
                event_id: event.event_id
            }),
        })

        if (response.status === 200){
            setIsAttending(true)
            setNumParticipants(numParticipants + 1)
        }
        else if(response.status === 401){
            setLoggedIn(false)
        }
    }

    async function backOutEvent(){
        const response = await fetch(envVariables.serverURL + "/event/backOutEvent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept : "application/json",
                'x-csrf-token': csrfToken
            },
            body: JSON.stringify({
                event_id: event.event_id
            }),
        })

        if (response.status === 200){
            setIsAttending(false)
            setNumParticipants(numParticipants - 1)
        }
        else if(response.status === 401){
            setLoggedIn(false)
        }
    }

    async function deleteEvent(){
        const response = await fetch(envVariables.serverURL + "/event/deleteEvent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept : "application/json",
                'x-csrf-token': csrfToken
            },
            body: JSON.stringify({
                event_id: event.event_id
            }),
        })

        if (response.status === 200){
            navigation.navigate('ExploreHome', {delete_id: event.event_id})
        }
        else if(response.status === 401){
            setLoggedIn(false)
        }
    }

    return(
        <>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StyledVertSpace space={15}></StyledVertSpace>
            <StyledText large>{event.title}</StyledText>
            <StyledVertSpace space={5}></StyledVertSpace>
            <StyledText bold small>({event.sport})</StyledText>
            <StyledVertSpace space={15}></StyledVertSpace>

            <Image style={{height:hs(220), width:"100%", alignSelf:'center'}} source={require('../post/knicks.png')}></Image>
            <StyledVertSpace space={15}></StyledVertSpace>

            <StyledText bold>Created By</StyledText>
            <StyledVertSpace space={15}></StyledVertSpace>
            <View style={{flexDirection:'row', gap:hs(10), alignItems:'center'}}>
                <TouchableWithoutFeedback onPress={() => navigation.push('Profile', {uid:event.uid})}>
                    <Image style={{width: pfpDimensions, height: pfpDimensions, borderRadius: pfpDimensions}} source={{uri:event.pfp}} />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => navigation.push('Profile', {uid:event.uid})}>
                <View>
                    <StyledText>{event.name}</StyledText>
                    <StyledText>@{event.username}</StyledText>
                </View>
                </TouchableWithoutFeedback>
            </View>
            <StyledVertSpace space={35}></StyledVertSpace>

            <StyledText bold>Time and Location</StyledText>
            <StyledVertSpace space={15}></StyledVertSpace>
            <StyledText>{getDay(eventDateTime)}, {getMonth(eventDateTime)} {eventDateTime.getDate()}</StyledText>
            <StyledVertSpace space={10}></StyledVertSpace>
            <StyledText>{eventDateTime.toLocaleTimeString('en-US', {timeStyle:'short'})}</StyledText>
            <StyledVertSpace space={10}></StyledVertSpace>
            <View style={{flexDirection:'row', alignItems:'center', gap:hs(5)}}>
                <TouchableWithoutFeedback onPress={() => openExternalMap()}>
                    <Ionicons name="location" size={ms(30)} color={'red'} ></Ionicons>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => openExternalMap()}>
                    <StyledText underline>Get Directions</StyledText>
                </TouchableWithoutFeedback>
            </View>
            <StyledVertSpace space={35}></StyledVertSpace>

            <StyledText bold>Event Description</StyledText>
            <StyledVertSpace space={15}></StyledVertSpace>
            <StyledText>{event.description}</StyledText>
            <StyledVertSpace space={100}></StyledVertSpace>

        </ScrollView>
        <View style={styles.bottomContainer}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('ParticipantList', {event_id:event.event_id})}>
                <StyledText bold>{numParticipants} Participants</StyledText>
            </TouchableWithoutFeedback>

            {selfUid === event.uid ? 
                <View style={{flexDirection:'row', gap:hs(5), flexWrap:'wrap'}}>
                    <StyledButton onPress={() => createDeletePostAlert()} bgColor='red'>
                        <StyledText>Delete</StyledText>
                    </StyledButton>
                    <StyledButton bgColor="gray">
                        <StyledText>Edit</StyledText>
                    </StyledButton>
                </View>
                :
                <>
                {!isAttending ? 
                    <StyledButton onPress={() => attendEvent()}>
                        <StyledText>Attend</StyledText>
                    </StyledButton>
                    :
                    <StyledButton bgColor="black" borderWidth={ms(2)} onPress={()=>backOutEvent()}>
                        <StyledText>Attending</StyledText>
                    </StyledButton>
                }
                </>
            }
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal:hs(10)
    },
    bottomContainer:{
        height: vs(80),
        width: '100%',
        position:'absolute',
        zIndex: 2,
        bottom:0,
        paddingHorizontal: hs(10),
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        borderTopWidth: ms(2),
        borderColor:'white',
        backgroundColor: "#121212",
    }
})