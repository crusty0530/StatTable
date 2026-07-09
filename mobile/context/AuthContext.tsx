import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/auth-js";
import { supabase } from "../lib/supabase";

export interface Profile {
    id: string
    email: string
    username: string
    avatar: string | null
    favorite_deck_id: string | null
}

interface AuthContextType {
    session: Session | null
    profile: Profile | null
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: AuthProviderProps){

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

    return(
        <AuthContext.Provider value={{ session, profile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}