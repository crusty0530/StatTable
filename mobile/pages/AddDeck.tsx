import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { ScryfallCard } from "../types";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function AddDeck() {

    const [ commanderName, setCommanderName ] = useState("")
    const [ deckName, setDeckName ] = useState("")
    const [ playstyle, setPlaystyle ] = useState("")
    const [ scryfallResults, setScryfallResults ] = useState<ScryfallCard[]>([])
    const [ commander, setCommander ] = useState<ScryfallCard | null>(null)
    const [ loading, setLoading ] = useState(false)
    const { session } = useAuth()
    const navigation = useNavigation()

    const searchCommanders = async () => {
        setLoading(true)

        const searchResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/search/commanders?q=${commanderName}`)
        const searchData = await searchResponse.json()
        setScryfallResults(searchData)

        setLoading(false)
    }

    const saveDeck = async () => {
        console.log('saveDeck called')
        console.log('commander:', commander)
        console.log('deckName:', deckName)
        const body = {
            deck_name: deckName,
            playstyle: playstyle,
            commander_name: commander?.card_faces?.[0]?.name ?? commander?.name,
            commander_image_uri: commander?.image_uris?.normal ?? commander?.card_faces?.[0]?.image_uris?.normal ?? "",
            color_identity: commander?.color_identity,
            scryfall_id: commander?.id
        }

        try {
            const saveResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/decks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify(body)
            })
            console.log('save status:', saveResponse.status)
            if (saveResponse.ok) {
                navigation.goBack()
            }
        } catch (err) {
            console.log('save error:', err)
        }
    }

    return(
        <View>
            <Text>Commander Name:</Text>
            <TextInput value={commanderName} onChangeText={setCommanderName}/>

            <Button title="Search" onPress={searchCommanders}/>

            {scryfallResults.length > 0 ? (
                scryfallResults.map((scryfallResult) => (
                    <TouchableOpacity key={scryfallResult.id} onPress={() => setCommander(scryfallResult)}>
                        <Text>{scryfallResult.name}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text>No Results</Text>
            )}

            {commander ? (
                <>
                    <Text>Deck Name:</Text>
                    <TextInput value={deckName} onChangeText={setDeckName}/>

                    <Text>Playstyle:</Text>
                    <TextInput value={playstyle} onChangeText={setPlaystyle}/>
                </>
            ) : null}

            <Button title="Save" onPress={saveDeck}/>
        </View>
    )
}