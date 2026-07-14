import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';

import Dashboard from './pages/Dashboard';
import Pod from './pages/Pod';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AuthProvider, { useAuth } from './context/AuthContext';
import DeckStack from './pages/DecksStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayerSetup from './pages/PlayerSetup';
import LiveGame from './pages/LiveGame';



const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

export function TabNavigator(){
  return(
    <Tab.Navigator screenOptions={{ headerShown: false }}>
                  <Tab.Screen name='Dashboard' component={Dashboard}/>
                  <Tab.Screen name='Decks' component={DeckStack}/>
                  <Tab.Screen name='Pod' component={Pod}/>
                  <Tab.Screen name='Profile' component={Profile}/>
              </Tab.Navigator>
  )
}

export function AppNavigator(){

  const { session } = useAuth()

  return(
    <NavigationContainer>
      {session ? (
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name='Tabs' component={TabNavigator}/>
            <RootStack.Screen name='PlayerSetup' component={PlayerSetup}/>
            <RootStack.Screen name='LiveGame' component={LiveGame}/>
          </RootStack.Navigator>
      ) : (
          <Auth />
      )}
    </NavigationContainer>
  )
} 


export default function App() {

  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
  )
}
