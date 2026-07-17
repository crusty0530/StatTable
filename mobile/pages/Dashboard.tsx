import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, Text, Button, StyleSheet } from "react-native";
import { RootStackParamList } from "../types";

export default function Dashboard(){

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    return(
        <View style={styles.container}>
            <Button title="Start Game" onPress={() => navigation.navigate('PlayerSetup')}/>
            <Button title="Log Past Game" onPress={() => {}}/>
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