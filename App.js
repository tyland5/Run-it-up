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
import CommentSection from './src/Components/post/commentSection';
import ExpandedPost from './src/Components/post/expandedPost';
import MediaGallery from './src/Components/post/mediaGallery';
import TopNav from './src/Components/global/topNav';
import Profile from './src/Components/profile/profile';
import EditProfile from './src/Components/profile/editProfile';
import LoadingScreen from './src/Components/login/loadingScreen';
import FollowPage from './src/Components/profile/followPage';
import Settings from './src/Components/profile/settings';
import Explore from './src/Components/explore/explore';
import MakeEvent from './src/Components/explore/makeEvent';
import EventDetails from './src/Components/explore/eventDetails';
import ParticipantList from './src/Components/explore/participantList';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from './src/Components/login/authContext';
import { Provider } from 'react-redux';
import store from "./src/Components/post/likedPostsStore"
import Ionicons from 'react-native-vector-icons/Ionicons';
import {hs, vs, ms} from "./src/Components/global/responsiveScaling";


const LoginStack = createStackNavigator();
function LoginStackScreen() {
  return(
    <LoginStack.Navigator>
      <LoginStack.Screen options = {{headerShown:false}} name="LoadingScreen" component={LoadingScreen}/>
      <LoginStack.Screen options = {{headerShown:false}} name="Login" component={Login}/>
      <LoginStack.Screen name="Register" component={Register}/>
      <LoginStack.Screen name="Confirmation" component={EmailConfirm}/>
      <LoginStack.Screen name="ForgotPassword" component={ForgotPassword}/>
    </LoginStack.Navigator>
  )
}

const ExploreStack = createStackNavigator();
function ExploreStackScreen(){
  return(
    <ExploreStack.Navigator>
      <ExploreStack.Screen options = {{headerShown:false}} name = "ExploreHome" component={Explore}/>
      <ExploreStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Make Event"/>}} name = "MakeEvent" component={MakeEvent}/>
      <ExploreStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Event Details"/>}} name = "EventDetails" component={EventDetails}/>
      <ExploreStack.Screen options = {{header: () => <TopNav hasBackArrow ={true} title="Participants" />}} name="ParticipantList" component={ParticipantList} />

      <ExploreStack.Screen options = {{header: () => <TopNav hasBackArrow ={true} title="Comments" />}} name="Comments" component={CommentSection} />
      <ExploreStack.Screen options = {{headerShown:false}} name="MediaGallery" component={MediaGallery}/>
      <ExploreStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Profile" hasSettings={true}/>}} name="Profile" component={Profile} />
      <ExploreStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Profile"/>}} name="FollowPage" component={FollowPage} />
      <ExploreStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Edit Profile" />}} name="EditProfile" component={EditProfile} />
      <ExploreStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Settings"/>}} name="Settings" component={Settings} />
    </ExploreStack.Navigator>
  )
}

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen options= {{header: () => <TopNav />}} name="Home" component={HomeFeed} />
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Post"/>}} name="ExpandedPost" component={ExpandedPost} />
      <HomeStack.Screen options = {{headerShown:false}} name="MakePost" component={MakePost} />
      <HomeStack.Screen options = {{header: () => <TopNav hasBackArrow ={true} title="Comments" />}} name="Comments" component={CommentSection} />
      <HomeStack.Screen options = {{headerShown:false}} name="MediaGallery" component={MediaGallery}/>
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Profile" hasSettings={true}/>}} name="Profile" component={Profile} />
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Profile"/>}} name="FollowPage" component={FollowPage} />
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Edit Profile" />}} name="EditProfile" component={EditProfile} />
      <HomeStack.Screen options= {{header: () => <TopNav hasBackArrow ={true} title="Settings"/>}} name="Settings" component={Settings} />
    </HomeStack.Navigator>
  );
}


const Tab = createBottomTabNavigator();

function AppTabs(){

  /* if i wanted to hide bottom nav on certain screens
  tabBarStyle: getFocusedRouteNameFromRoute(route) === 'EventDetails' ? {display:'none'} : {backgroundColor: "#121212", height: vs(79, .25)}
  */

  return(
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle:{backgroundColor: "#121212", height: vs(79, .25)}, tabBarHideOnKeyboard: true, 
    tabBarActiveTintColor: "#F57600", tabBarInactiveTintColor: "white", tabBarLabelStyle: {fontSize: ms(14)}}}>
      
      <Tab.Screen name="HomeStack" component={HomeStackScreen} 
      options={{tabBarShowLabel: false,
        tabBarIcon: ({color}) => (<Ionicons name="home" size= {ms(30)} color= {color}/>)
      }}/>

      <Tab.Screen name="Explore" component={ExploreStackScreen} 
      options={({route}) => ({tabBarShowLabel: false,
        tabBarIcon: ({color}) => (<Ionicons name="search" size= {ms(30)} color= {color}/>)
      })}/>

    </Tab.Navigator>
  )
}

const RootStack = createStackNavigator();

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [selfUid, setSelfUid] = useState(0)
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() =>{
    // put in logic that checks if stored credentials are valid if there even is any
    StatusBar.setBarStyle('light-content');
  }, [])

  return (
    <AuthContext.Provider value={{loggedIn, setLoggedIn, selfUid, setSelfUid, csrfToken, setCsrfToken}}>
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          {loggedIn ? <RootStack.Screen name= "appTabs" component={AppTabs}/> :
          <RootStack.Screen name= "loginStack" component={LoginStackScreen}/>
          }
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
    </AuthContext.Provider>
  );
}
