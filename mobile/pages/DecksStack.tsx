import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Decks from "./Decks";
import AddDeck from "./AddDeck";

const Stack = createNativeStackNavigator()

export default function DeckStack() {
    return (
        <Stack.Navigator>
                <Stack.Screen name="DeckList" component={Decks}/>
                <Stack.Screen name="AddDeck" component={AddDeck}/>
        </Stack.Navigator>
    )
}