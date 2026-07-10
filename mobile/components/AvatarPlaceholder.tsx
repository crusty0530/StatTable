import { View, Text, StyleSheet } from "react-native";

interface Props {
    username: string
    size?: number
}

export default function AvatarPlaceholder({ username, size = 60 }: Props) {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.letter, { fontSize: size / 2 }]}>
                {username.charAt(0).toUpperCase()}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        color: 'white',
        fontWeight: 'bold',
    }
})