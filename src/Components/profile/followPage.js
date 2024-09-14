import React, { useEffect, useCallback, useMemo, useState, useContext } from "react";
import { FlatList, StyleSheet, View} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ProfileList from "./profileList";
import { AuthContext } from "../login/authContext";

const envVariables = require('../../../envVariables.json');

export default function FollowPage({route}){
    const [followData, setFollowData] = useState([])
    const {setLoggedIn} = useContext(AuthContext)

    useEffect(()=>{
        // here i would have to fetch the followers and following
        getFollowInfo()
    }, [])
    
    const getFollowInfo = async () =>{
        const res = await fetch(envVariables.serverURL + "/user/getFollowersFollowing?" + new URLSearchParams({uid: route.params.uid}));
        
        if(res.status === 200){
            const jsonRes = await res.json();
        
            setFollowData(jsonRes.res)
            return
        }
        else if(res.status === 401){
            setLoggedIn(false)
        }
        
        // 500 error, show no data
        setFollowData([[],[]])
    }


    const renderTabBar = props =>(
        <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'white' }}
        style={{ backgroundColor: "#121212" }}
        />
    )
    const routes = React.useMemo( () => [
        { key: 'Followers', title: 'Followers' },
        { key: 'Following', title: 'Following' },
      ], []);
    const index = React.useMemo( () => route.params.activeRouteIndex, []);
    
    //<ProfileList data = {['','','']}/>
    return (
        <View style={styles.container}>

            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                onIndexChange={() => {return}}
                renderScene={SceneMap({
                    Followers: useCallback(() => {return <ProfileList data = {followData[0]}/>}, [followData]),
                    Following: useCallback(() => {return <ProfileList data = {followData[1]}/>}, [followData]),
                })}
            />

        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#121212", 
        flex: 1, 
        width: "100%"
    },
})