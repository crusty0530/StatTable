import { useState } from "react"
import { TextInput, View, Text, TouchableOpacity } from "react-native"
import { supabase } from "../lib/supabase"
import { StyleSheet } from "react-native"

export default function Auth(){
    const [ email, setEmail ] = useState("")
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ isLogin, setIsLogin ] = useState(false)

    const handleSubmit = async () => {
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) console.log(error.message)
        } else {
            const { error } = await supabase.auth.signUp({ email, password, options: { data: { username } } })
            if (error) console.log(error.message)
        }
    }
    
    return(
        <View style={styles.container}>
            <View>
                <TouchableOpacity onPress={() => setIsLogin(true)}>
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsLogin(false)}>
                    <Text>Register</Text>
                </TouchableOpacity>
            </View>

            {!isLogin && (
                <>
                    <Text>Username:</Text>
                    <TextInput value={username} onChangeText={setUsername} style={styles.textBox}/>
                </>
            )}
            

            <Text>Email:</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.textBox}/>

            <Text>Password:</Text>
            <TextInput value={password} onChangeText={setPassword} style={styles.textBox} secureTextEntry={true}/>

            <TouchableOpacity onPress={handleSubmit}>
                <Text>{isLogin ? "Login" : "Register"}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff'
    },

    textBox: {
        height: 40,
        width: 250,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
    }
})