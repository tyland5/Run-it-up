import React, { useContext } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import { hs,vs,ms } from '../global/responsiveScaling';
import { StyledText } from '../global/styledComponents';
import { AuthContext } from '../login/authContext';
import { useDispatch } from 'react-redux';
import { clearLikes } from '../post/likedPostsStore';

const envVariables = require('../../../envVariables.json');

export default function Settings(){
    const {setLoggedIn, setSelfUid, setCsrfToken} = useContext(AuthContext)
    const dispatch = useDispatch()

    async function logout(){
        const response = await fetch(envVariables.serverURL + "/user/logout")
        if(response.status === 200){
            dispatch(clearLikes()) // likes messed up since i guess it survives log outs to different account
            setLoggedIn(false)
            setSelfUid(-1)
            setCsrfToken('')
        }
    }
    
    return(
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => logout()}>
            <View style={{marginTop: vs(10)}}>
                <StyledText bold large color="red">Log out</StyledText>
            </View>
        </TouchableWithoutFeedback>
    </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#121212", 
        flex:1,
        width:'100%',
        paddingHorizontal: hs(5) 
    }
})