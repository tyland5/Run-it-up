import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/Components/login/login';
import Register from './src/Components/login/register';
import EmailConfirm from './src/Components/login/emailConfirm';
import ForgotPassword from './src/Components/login/forgotPassword';
import HomeFeed from './src/Components/home/homeFeed';
import MakePost from './src/Components/home/makePost';
import ExpandedPost from './src/Components/post/expandedPost';
import MediaGallery from './src/Components/post/mediaGallery';
import TopNav from './src/Components/global/topNav';
import Profile from './src/Components/profile/profile';
import FollowPage from './src/Components/profile/followPage';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from './src/Components/login/authContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {hs, vs, ms} from "./src/Components/global/responsiveScaling";



const LoginStack = createStackNavigator();
function LoginStackScreen() {
  return(
    <LoginStack.Navigator>
      <LoginStack.Screen options = {{headerShown:false}} name="Login" component={Login}/>
      <LoginStack.Screen name="Register" component={Register}/>
      <LoginStack.Screen name="Confirmation" component={EmailConfirm}/>
      <LoginStack.Screen name="ForgotPassword" component={ForgotPassword}/>
    </LoginStack.Navigator>
  )
}

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen options= {{header: () => <TopNav />}} name="Home" component={HomeFeed} />
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Post"/>}} name="ExpandedPost" component={ExpandedPost} />
      <HomeStack.Screen options = {{headerShown:false}} name="MakePost" component={MakePost} />
      <LoginStack.Screen options = {{headerShown:false}} name="MediaGallery" component={MediaGallery}/>
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Profile"/>}} name="Profile" component={Profile} />
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Profile"/>}} name="FollowPage" component={FollowPage} />
    </HomeStack.Navigator>
  );
}


const Tab = createBottomTabNavigator();

function AppTabs(){
  return(
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle:{backgroundColor: "#121212", height: vs(79, .25)}, tabBarHideOnKeyboard: true, 
    tabBarActiveTintColor: "#F57600", tabBarInactiveTintColor: "white", tabBarLabelStyle: {fontSize: ms(14)}}}>
      
      <Tab.Screen name="HomeStack" component={HomeStackScreen} 
      options={{tabBarShowLabel: false,
        tabBarIcon: ({color}) => (<Ionicons name="home" size= {ms(30)} color= {color}/>)
      }}/>

      <Tab.Screen name="Explore" component={HomeStackScreen} 
      options={{tabBarShowLabel: false,
        tabBarIcon: ({color}) => (<Ionicons name="search" size= {ms(30)} color= {color}/>)
      }}/>

    </Tab.Navigator>
  )
}

const RootStack = createStackNavigator();

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() =>{
    // put in logic that checks if stored credentials are valid if there even is any
    StatusBar.setBarStyle('light-content');
  }, [])

  return (
    <AuthContext.Provider value={[loggedIn, setLoggedIn]}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          {loggedIn ? 
          <RootStack.Screen name= "appTabs" component={AppTabs}/> :
          <RootStack.Screen name= "loginStack" component={LoginStackScreen}/>
          }
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
