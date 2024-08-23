import React, { useEffect, useCallback, useMemo } from "react";
import { FlatList, StyleSheet, View} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ProfileList from "./profileList";

export default function FollowPage({route}){

    useEffect(()=>{
        // here i would have to fetch the followers and following
    }, [])
    
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
                    Followers: useCallback(() => {return <ProfileList data = {['','','','','','','','','','']}/>}, []),
                    Following: useCallback(() => {return <ProfileList data = {['','','']}/>}, []),
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