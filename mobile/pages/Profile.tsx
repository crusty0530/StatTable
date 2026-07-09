import { View, Text } from "react-native";
import { useAuth, Profile as UserProfile } from "../context/AuthContext";

export default function Profile(){

    const { session, profile } = useAuth()

    if (!profile) return <Text>Loading...</Text>

    return(
        <View>
            <Text>{profile.username}</Text>
        </View>
    )
}