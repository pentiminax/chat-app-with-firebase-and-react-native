import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import FirebaseService from '../firebase/firebase';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        await FirebaseService.login(email, password);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <TextInput
                autoFocus={true}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Adresse e-mail"
                style={styles.input}
            />
            <TextInput
                autoCorrect={false}
                onChangeText={setPassword}
                placeholder="Mot de passe"
                secureTextEntry={true}
                style={styles.input}
                textContentType="password"
            />
            <Button disabled={email.length === 0 || password.length === 0} onPress={handleLogin} title="Se connecter" />
            <Text style={styles.text}>Pas encore inscrit ?</Text>
            <Button
                color="gray"
                onPress={() => navigation.navigate('Register')}
                title="S'inscrire" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 12
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 12
    },
    text: {
        fontSize: 18,
        padding: 12,
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#444',
        alignSelf: 'center',
        paddingBottom: 24
    }
});