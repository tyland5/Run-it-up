import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/Components/login/login';
import HomeFeed from './src/Components/home/homeFeed';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from './src/Components/login/authContext';



const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeFeed} />
    </HomeStack.Navigator>
  );
}


const Tab = createBottomTabNavigator();

function AppTabs(){
  return(
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
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
