import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../login/authContext";
import { View, StyleSheet, ScrollView, TextInput, Platform, Dimensions, Image} from "react-native";
import { StyledButton, StyledText, StyledTextInput, StyledVertSpace } from "../global/styledComponents";
import { hs, vs, ms } from "../global/responsiveScaling";
import { getRightDateObj } from "../../functions/global";

const pfpDimensions = Dimensions.get('window').width * .15

export default function EventDetails({route}){
    const event = route.params.info
    const [eventDateTime, setEventDateTime] = useState(new Date(event.event_datetime))
    const getDay = new Intl.DateTimeFormat('en', { weekday:'long'});
    const getMonth = new Intl.DateTimeFormat('en', { month:'long'});

    useEffect(()=>{
        // https://stackoverflow.com/questions/22061999/how-should-i-store-data-for-events-in-different-timezones
        // https://stackoverflow.com/questions/19166995/java-calendar-date-and-time-management-for-a-multi-timezone-application/19170823#19170823
        // The parameter values are all evaluated against the local time zone, rather than UTC. Date.UTC() accepts similar parameters but interprets the components as UTC and returns a timestamp.
        
        // this might be useful to check if an event has past
        const dateObj = getRightDateObj(new Date(event.event_datetime))
    }, [])

    return(
        <ScrollView style={styles.container}>
            <StyledVertSpace space={vs(15)}></StyledVertSpace>
            <StyledText large>{event.title}</StyledText>
            <StyledVertSpace space={vs(15)}></StyledVertSpace>

            <Image style={{height:hs(220), width:"100%", alignSelf:'center'}} source={require('../post/knicks.png')}></Image>
            <StyledVertSpace space={vs(15)}></StyledVertSpace>

            <StyledText bold>Created By</StyledText>
            <StyledVertSpace space={vs(15)}></StyledVertSpace>
            <View style={{flexDirection:'row', gap:hs(10), alignItems:'center'}}>
                <Image style={{width: pfpDimensions, height: pfpDimensions, borderRadius: pfpDimensions}} source={{uri:event.pfp}} />
                <View>
                    <StyledText>{event.name}</StyledText>
                    <StyledText>@{event.username}</StyledText>
                </View>
            </View>
            <StyledVertSpace space={vs(35)}></StyledVertSpace>

            <StyledText bold>Time and Location</StyledText>
            <StyledVertSpace space={vs(15)}></StyledVertSpace>
            <StyledText>{getDay.format(eventDateTime)}, {getMonth.format(eventDateTime)} {eventDateTime.getDate()}</StyledText>
            <StyledText>{eventDateTime.toLocaleTimeString('en-US', {timeStyle:'short'})}</StyledText>
            <StyledVertSpace space={vs(35)}></StyledVertSpace>

            <StyledText bold>Event Description</StyledText>
            <StyledVertSpace space={vs(15)}></StyledVertSpace>
            <StyledText>{event.description}</StyledText>
            <StyledVertSpace space={vs(35)}></StyledVertSpace>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal:hs(10)
    }
})