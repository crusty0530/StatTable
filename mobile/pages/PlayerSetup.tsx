import { useEffect, useState } from "react";
import { View, Text, ScrollView, Button, TextInput, TouchableOpacity, StyleSheet, Switch, Keyboard, TouchableWithoutFeedback } from "react-native";
import { GamePlayer, RootStackParamList, UserSearchResult } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function PlayerSetup(){

    const { profile, session } = useAuth()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const [ players, setPlayers ] = useState<GamePlayer[]>([])
    const [ timerEnabled, setTimerEnabled ] = useState(false)
    const [ turnLength, setTurnLength ] = useState(0)
    const [ searchQuery, setSearchQuery ] = useState("")
    const [ searchResults, setSearchResults ] = useState<UserSearchResult[]>([])
    const toggleTimer = () => setTimerEnabled(!timerEnabled)

    useEffect(() => {
        if (!profile) return
        setPlayers([{
            user_id: profile.id,
            username: profile.username,
            deck_id: null,
            deck_name: null
        }])
    }, [profile])

    const searchUsers = async () => {
        if (!session) return

        const usersResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/search?username=${searchQuery}`, {
            headers: { Authorization: `Bearer ${session.access_token}`}
        })
        const usersData = await usersResponse.json()
        setSearchResults(usersData ?? [])
    }

    const addPlayer = (result: UserSearchResult) => {
        setPlayers([...players, {
            user_id: result.id,
            username: result.username,
            deck_id: null,
            deck_name: null
        }])
        setSearchQuery("")
        setSearchResults([])
    }

    const addGuest = () => {
        if (!searchQuery.trim()) return

        setPlayers([...players, {
            user_id: null,
            username: searchQuery,
            deck_id: null,
            deck_name: null
        }])
        setSearchQuery("")
        setSearchResults([])
    }

    return(
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    {players.map((player, index) => (
                        <Text key={index}>{player.username}</Text>
                    ))}

                    {players.length < 4 ? (
                        <View>
                            <Text>Add Another Player</Text>
                            <TextInput value={searchQuery} onChangeText={setSearchQuery}/>
                            <Button title="Search" onPress={searchUsers}/>
                            <Button title="Add Guest" onPress={addGuest}/>
                            {searchResults.map((result, index) => (
                                <TouchableOpacity key={index} onPress={() => addPlayer(result)}>
                                    <Text>{result.username}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        null
                    )}

                    {players.length >= 2 ? (
                        <Button title="Start Game" onPress={() => navigation.navigate('LiveGame', {
                            players: players,
                            timerEnabled: timerEnabled,
                            turnLength: turnLength
                        })}/>
                    ) : (
                        null
                    )}

                    <View>
                        <Text>Turn Timer</Text>
                        <Switch onValueChange={toggleTimer} value={timerEnabled}/>

                        {timerEnabled ? (
                            <View>
                                <Text>Timer Length (sec)</Text>
                                <TextInput value={turnLength.toString()} onChangeText={(text) => setTurnLength(Number(text))} keyboardType="numeric"/>
                            </View>
                        ) : (
                            null
                        )}
                    </View>
                    
                </ScrollView>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 70
    },
});