import { View, Text, Button, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { DeckResponse } from "../types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type DecksStackParamList = {
    Decklist: undefined
    AddDeck: undefined
}

export default function Decks(){

    const { session } = useAuth()
    const [ decks, setDecks ] = useState<DeckResponse[]>([])
    const [ selectedDeck, setSelectedDeck ] = useState<string | null>(null)
    const navigation = useNavigation<NativeStackNavigationProp<DecksStackParamList>>()

    const fetchDecks = async () => {
        if (!session) return

        const decksResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/decks/${session.user.id}`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
        })
        const decksData = await decksResponse.json()
        setDecks(decksData)
    }

    useFocusEffect(
        useCallback(() => {
            fetchDecks()
        }, [session])
    )

    const deleteDeck = async () => {

        const deleteResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/decks/${selectedDeck}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`
            }
        })

        if (deleteResponse.ok) {
            setSelectedDeck(null)
            fetchDecks()
        }
    }

    if (!session) return <Text>Loading...</Text>

    return(
        <View>
            {decks.length > 0 ? (
                decks.map((deck) => (
                    <TouchableOpacity key={deck.id} onPress={() => setSelectedDeck(deck.id)}>
                        <Text>{deck.deck_name}</Text>
                        <Text>{deck.commander_name}</Text>
                        <Text>{"\n"}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text>No Decks</Text>
            )}

            <Button title="Delete Deck" onPress={() => {deleteDeck()}} disabled={selectedDeck === null}/>
            <Button title="Add Deck" onPress={() => navigation.navigate('AddDeck')}/>
        </View>
    )
}