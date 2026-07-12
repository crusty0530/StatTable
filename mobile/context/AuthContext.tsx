import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/auth-js";
import { supabase } from "../lib/supabase";
import { PlayerStats, Profile } from "../types";

interface AuthContextType {
    session: Session | null
    profile: Profile | null
    stats: PlayerStats | null
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: AuthProviderProps){

    const [ session, setSession ] = useState<Session | null>(null)
    const [ profile, setProfile ] = useState<Profile | null>(null)
    const [ stats, setStats ] = useState<PlayerStats | null>(null)
        
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
    
            const fetchData = async () => {
                const profileResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profile/${session.user.id}`, {
                    headers: { Authorization: `Bearer ${session.access_token}` }
                })
                const profileData = await profileResponse.json()
                setProfile(profileData)

                const statsResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/stats/${session.user.id}`, {
                    headers: { Authorization: `Bearer ${session.access_token}` }
                })
                const statsData = await statsResponse.json()
                setStats(statsData)
            }
            fetchData()
        }, [session])

    return(
        <AuthContext.Provider value={{ session, profile, stats }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}