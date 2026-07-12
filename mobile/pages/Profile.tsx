import { View, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Profile as UserProfile } from "../types";
import { StyleSheet } from "react-native";
import { Image } from "react-native";

import AvatarPlaceholder from "../components/AvatarPlaceholder";

export default function Profile(){

    const { session, profile, stats } = useAuth()

    if (!profile) return <Text>Loading...</Text>

    return(
        <View>
            <View style={styles.top_container}>
                {profile.avatar ? (
                    <Image source={{ uri: profile.avatar }} />
                ) : (
                    <AvatarPlaceholder username={profile.username} />
                )}
                
                <Text>{profile.username}</Text>

                {profile.favorite_deck_id ? (
                    <Text>{profile.favorite_deck_id}</Text>
                ) : (
                    <Text>N/A</Text>
                )}
                
            </View>
            <View>
                <Text>Total Games Played:</Text>
                <Text>{stats?.total_games_played} games</Text>

                <Text>Total Wins:</Text>
                {stats?.total_wins == 1 ? (
                    <Text>{stats?.total_wins} win</Text>
                ) : (
                    <Text>{stats?.total_wins} wins</Text>
                )}

                <Text>Win Rate:</Text>
                <Text>{stats?.win_rate}% win rate</Text>

                <Text>Average Placement:</Text>
                <Text>{stats?.average_placement} place</Text>

                <Text>Most Played Deck:</Text>
                {stats?.most_played_deck == "" ? (
                    <Text>N/A</Text>
                ) : (
                    <Text>{stats?.most_played_deck}</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    top_container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start', 
        alignItems: 'center',         
        paddingTop: 70,
    },
});