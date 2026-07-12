import { View, Text, Button } from "react-native";
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
    const navigation = useNavigation<NativeStackNavigationProp<DecksStackParamList>>()

    const fetchDecks = async () => {
        if (!session) return

        console.log('fetching decks...')
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

            <Button title="Add Deck" onPress={() => navigation.navigate('AddDeck')}/>
        </View>
    )
}