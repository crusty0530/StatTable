import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/auth-js";

interface Profile {
    id: string
    email: string
    username: string
    avatar: string | null
    favorite_deck_id: string | null
}

export default function Profile(){

    const [ session, setSession ] = useState<Session | null>(null)
    const [ profile, setProfile ] = useState<Profile | null>(null) 
    
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

    useEffect(() => {
        if(!session) return

        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (data) setProfile(data)
        }
        fetchProfile()
    }, [session])

    if (!profile) return <Text>Loading...</Text>

    return(
        <View>
            <Text>{profile.username}</Text>
        </View>
    )
}