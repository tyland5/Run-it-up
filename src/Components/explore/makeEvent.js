import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../login/authContext";
import { View, StyleSheet, ScrollView, TextInput, Platform, KeyboardAvoidingView, Appearance} from "react-native";
import { StyledButton, StyledText, StyledTextInput } from "../global/styledComponents";
import { hs, vs, ms } from "../global/responsiveScaling";
import { useHeaderHeight } from '@react-navigation/elements';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDay, getMonth } from "../../functions/global";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getRightDateObj } from "../../functions/global";

const envVariables = require('../../../envVariables.json');

export default function MakeEvent({route}){
    const [eventTitle, setEventTitle] = useState('')
    const [description, setDescription] = useState('')
    const [sport, setSport] = useState('')
    const [date, setDate] = useState(new Date(Date.now()))
    const [time, setTime] = useState(new Date(Date.now()))
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const navigation = useNavigation()
    const height = useHeaderHeight()
    const {csrfToken, setLoggedIn, selfUid} = useContext(AuthContext)
    const uInfo = useSelector((state) => state.accountInfo.value)

    const data = [
        { label: 'Basketball', value: 'Basketball' },
        { label: 'Baseball', value: 'Baseball' },
        { label: 'Football', value: 'Football' },
        { label: 'Soccer', value: 'Soccer' },
        { label: 'Tennis', value: 'Tennis' },
    ];


    // Important note, we are entrusting users to enter the right time depending on place. 
    // In other words, don't handle timezones here since assume inputted time is right for zone
    // stored in UTC timezone. be careful. when retrieving, automatically casts new Date on it which adds offset depending on users location/time zone
    async function createNewEvent(){
        const event_date = date.toISOString().slice(0, 19).replace('T', ' ');
        const event_time = time.toISOString().slice(0, 19).replace('T', ' ');
        const event_dateTime = event_date.slice(0,11) + event_time.slice(11);
        const param_event_dateTime = event_date.slice(0,10) + "T" + event_time.slice(11); // if successful, pass good date obj format to map

        const response = await fetch(envVariables.serverURL + "/event/makeEvent",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept : "application/json",
                'x-csrf-token': csrfToken
            },
            body: JSON.stringify({
                title: eventTitle,
                description: description,
                sport: sport,
                dateTime: event_dateTime,
                latitude: route.params.coordinate.latitude,
                longitude: route.params.coordinate.longitude
            }),
        })


        if(response.status === 200){
            const respJson = await response.json()
            const newEventId = respJson.res

            const latitude = route.params.coordinate.latitude
            const longitude = route.params.coordinate.longitude
            navigation.navigate('ExploreHome', {event_id:newEventId, title:eventTitle, description: description, sport:sport, event_datetime:param_event_dateTime, 
                latitude: latitude, longitude: longitude, uid: selfUid, pfp:uInfo.pfp, username:uInfo.username, name:uInfo.name})
        }
        else if(response.status === 401){
            setLoggedIn(false)
        }

    }

    return(
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? height : 0}
        style={styles.container}>
        <ScrollView keyboardDismissMode={'none'}>

            <View style={styles.section}>
                <StyledText marginBottom={vs(10)}>Event Title</StyledText> 
                <StyledTextInput maxLength={60} placeholder='Title' placeholderTextColor="gray" value ={eventTitle} onChangeText={(val) => setEventTitle(val)}></StyledTextInput>
            </View>
    
            <View style={styles.section}>
                <StyledText marginBottom={vs(10)}>Which sport?</StyledText> 
                <Dropdown
                    style={styles.dropdown}
                    labelField="label"
                    valueField="value"
                    data={data}
                    value={sport}
                    maxHeight={vs(150)}
                    onChange={(item)=>{
                        setSport(item.value)
                    }}
                    placeholder="Select item"
                    placeholderStyle = {{fontSize:ms(16), color:'white'}}
                    selectedTextStyle={{fontSize:ms(16), color:'white'}}
                />
            </View>

            <View style={styles.section}>
                <StyledText marginBottom={vs(10)}>Event Description</StyledText> 
                <TextInput maxLength={500} style = {styles.description} multiline={true} placeholder='Description' placeholderTextColor="gray" value ={description} onChangeText={(val) => setDescription(val)}></TextInput>
                <View style={{alignSelf:'flex-end', marginRight:'20%'}}><StyledText>{description.length}/500</StyledText></View>
            </View>

            <View style={styles.section}>
                <StyledText marginBottom={vs(10)}>Date</StyledText> 

                {Platform.OS === "android" &&
                    <StyledButton onPress={() => setShowDatePicker(true)} bgColor='gray'>
                        <StyledText>Pick a date</StyledText>
                    </StyledButton>
                }

                {/* Time zone is based on where the user is here*/
                    (showDatePicker || Platform.OS === "ios") && 
                    <View style={{alignItems:'flex-start'}}>
                        <DateTimePicker
                            mode="date"
                            minimumDate={new Date(Date.now())}
                            value={date}
                            onChange={(event, date) => {
                                setShowDatePicker(false)
                                if(event.type ==="set"){
                                    // need this because date val is chosen in utc time, not local. issue if current day is ahead or behind utc
                                    // we want local for date since we want to disable the prior day
                                    const goodObj = getRightDateObj(date) 
                                    setDate(goodObj)
                                }
                            }}
                        />
                    </View>
                }

                {Platform.OS === "android" &&
                    <StyledText bold>Selected: {getMonth(date)} {date.getDate()}, {date.getFullYear()}</StyledText>
                }

            </View>

            <View style={styles.section}>
                <StyledText marginBottom={vs(10)}>Time</StyledText>

                {Platform.OS === "android" &&
                    <StyledButton onPress={() => setShowTimePicker(true)} bgColor='gray'>
                        <StyledText>Pick a time</StyledText>
                    </StyledButton>
                }

                {(showTimePicker || Platform.OS === "ios") &&
                <View style={{alignSelf:'flex-start'}}>
                    <DateTimePicker
                        mode="time"
                        value={time}
                        timeZoneName="UTC"
                        onChange={(event) => {
                            setShowTimePicker(false)
                            if(event.type ==="set"){
                                setTime(new Date(event.nativeEvent.timestamp))
                            }
                        }}
                    />
                </View>
                }

                {Platform.OS === "android" &&
                    <StyledText bold>Selected: {time.toLocaleTimeString('en-US', {timeStyle:'short', timeZone:'UTC'})}</StyledText>
                }
            </View>
            
            <View style={{alignItems:'center', marginTop:vs(20), marginBottom:vs(40)}}>
                <StyledButton large onPress={() => createNewEvent()}>
                    <StyledText>Create Event</StyledText>
                </StyledButton>
            </View>

        </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#121212",
        paddingLeft: hs(15),
        paddingTop: vs(15),
        gap:vs(15)
    },
    description:{
        maxHeight:vs(250),
        width: "80%",
        color: 'white',
        paddingVertical: vs(10), 
        paddingHorizontal: hs(10),
        fontSize: ms(16),
        borderWidth: ms(2),
        borderColor: 'white',
        borderRadius: ms(8)
    },
    section:{
        marginBottom: vs(20)
    },
    dropdown:{
        width: "80%",
        borderColor: 'white',
        borderWidth: ms(2),
        borderRadius: 8,
        paddingHorizontal: hs(10),
        paddingVertical: vs(10)
    }
})