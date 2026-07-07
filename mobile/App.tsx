import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

import Dashboard from './pages/Dashboard';
import Decks from './pages/Decks';
import Pod from './pages/Pod';
import Profile from './pages/Profile';
import Auth from './pages/Auth';



const Tab = createBottomTabNavigator();


export default function App() {
  
  const [ session, setSession ] = useState<Session | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    getSession()

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
  }, [])

  return (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
