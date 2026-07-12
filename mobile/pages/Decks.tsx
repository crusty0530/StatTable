import { View, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { DeckResponse } from "../types";

export default function Decks(){

    const { session } = useAuth()
    const [ decks, setDecks ] = useState<DeckResponse[]>([])

    useEffect(() => {
        if (!session) return

        const fetchDecks = async () => {
            console.log('fetching decks...')
            const decksResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/decks/${session.user.id}`, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            })
            const decksData = await decksResponse.json()
            setDecks(decksData)
        }
        fetchDecks()
    }, [session])

    if (!session) return <Text>Loading...</Text>

    return(
        <View>
            {decks.length > 0 ? (
                decks.map((deck) => (
                    <View key={deck.id}>
                        <Text>{deck.deck_name}</Text>
                        <Text>{deck.commander_name}</Text>
                    </View>
                ))
            ) : (
                <Text>No Decks</Text>
            )}
        </View>
    )
}