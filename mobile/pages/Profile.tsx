import { View, Text } from "react-native";
import { useContext } from "react";
import { AuthContext, Profile as UserProfile } from "../context/AuthContext";

export default function Profile(){

    const context = useContext(AuthContext)
    if (!context) return null

    const { session, profile } = context

    if (!profile) return <Text>Loading...</Text>

    return(
        <View>
            <Text>{profile.username}</Text>
        </View>
    )
}