import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';

import Dashboard from './pages/Dashboard';
import Decks from './pages/Decks';
import Pod from './pages/Pod';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AuthProvider, { useAuth } from './context/AuthContext';



const Tab = createBottomTabNavigator();

export function AppNavigator(){

  const { session } = useAuth()

  return(
    <NavigationContainer>
          {session ? (
              <Tab.Navigator screenOptions={{ headerShown: false }}>
                  <Tab.Screen name='Dashboard' component={Dashboard}/>
                  <Tab.Screen name='Decks' component={Decks}/>
                  <Tab.Screen name='Pod' component={Pod}/>
                  <Tab.Screen name='Profile' component={Profile}/>
              </Tab.Navigator>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
