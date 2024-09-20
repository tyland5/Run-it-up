import { View, StyleSheet} from "react-native"
import ProfileList from "../profile/profileList"
import { useEffect, useState, useContext} from "react";
import { AuthContext } from "../login/authContext";
import { StyledText } from "../global/styledComponents";
import { vs } from "../global/responsiveScaling";

const envVariables = require('../../../envVariables.json');

export default function ParticipantList({route}){
    const [participants, setParticipants] = useState([])
    const {setLoggedIn} = useContext(AuthContext)

    useEffect(()=>{
        getParticipants()
    }, [])  

    async function getParticipants(){
        const res = await fetch(envVariables.serverURL + "/event/getParticipants?" + new URLSearchParams({event_id: route.params.event_id}));

        if(res.status===200){
            const resJson = await res.json()
            setParticipants(resJson.res)
        }
        else if (res.status===401){
            setLoggedIn(false)
        }
    }

    return(
        <>
            <View style={styles.container}>
                {participants.length === 0 && <StyledText large>No Participants</StyledText>}
                <ProfileList data = {participants}/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex:1,
    },
})