import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/Components/login/login';
import HomeFeed from './src/Components/home/homeFeed';
import ExpandedPost from './src/Components/post/expandedPost';
import TopNav from './src/Components/global/topNav';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from './src/Components/login/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';



const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen options= {{header: () => <TopNav />}} name="Home" component={HomeFeed} />
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Post"/>}} name="ExpandedPost" component={ExpandedPost} />
    </HomeStack.Navigator>
  );
}


const Tab = createBottomTabNavigator();

function AppTabs(){
  return(
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle:{backgroundColor: "#686D76"}, 
    tabBarActiveTintColor: "#F57600", tabBarInactiveTintColor: "#232020", tabBarLabelStyle: {fontSize: 12},}}>
      
      <Tab.Screen name="HomeStack" component={HomeStackScreen} 
      options={{tabBarLabel:"home",
        tabBarLabelStyle: {fontSize: 12},
        tabBarIcon: ({color}) => (<Ionicons name="home" size= {30} color= {color}/>)
      }}/>

      <Tab.Screen name="Explore" component={HomeStackScreen} 
      options={{tabBarLabel:"explore",
        tabBarIcon: ({color}) => (<Ionicons name="search" size= {30} color= {color}/>)
      }}/>

    </Tab.Navigator>
  )
}

const RootStack = createStackNavigator();

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() =>{
    // put in logic that checks if stored credentials are valid if there even is any
    console.log("hit use effect in app.js")
  }, [])

  return (
    <AuthContext.Provider value={[loggedIn, setLoggedIn]}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          {loggedIn ? 
          <RootStack.Screen name= "appTabs" component={AppTabs}/> :
          <RootStack.Screen name= "login" component={Login}/>
          }
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
