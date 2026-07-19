import { useRoute, RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { RootStackParamList } from "../types";

export default function LiveGame(){

    const route = useRoute<RouteProp<RootStackParamList, 'LiveGame'>>()
    const { players, timerEnabled, turnLength } = route.params

    const [ lifeTotals, setLifeTotals ] = useState<Record<string, number>>({})
    const [ turnCount, setTurnCount ] = useState(0)
    const [ activePlayer, setActivePlayer ] = useState(players[0])
    const [ timerRunning, setTimerRunning ] = useState(false)
    const [ remainingTime, setRemainingTimer ] = useState(0)
    const [ eliminatedPlayers, setEliminatedPlayers ] = useState<string[]>([])

    useEffect(() => {
        if (players.length < 2) return
        
        const initialTotals = players.reduce((acc, player) => {
            acc[player.username] = 40
            return acc
        }, {} as Record<string, number>)
        setLifeTotals(initialTotals)
    }, [])

    const adjustLife = (player: string, amount: number) => {
        setLifeTotals({
            ...lifeTotals,
            [player]: lifeTotals[player] + amount
        })
    }

    return(
        <View style={styles.container}>
            {players.map((player, index) => (
                <View key={index}>
                    <Text>{player.username}</Text>
                    <Text>{lifeTotals[player.username]}</Text>
                    <Button title="+1" onPress={() => adjustLife(player.username, 1)}/>
                    <Button title="-1" onPress={() => adjustLife(player.username, -1)}/>
                </View>
            ))}
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