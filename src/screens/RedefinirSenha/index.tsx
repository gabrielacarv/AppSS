import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import axios from 'axios';
import UserService from '../../services/userService';
import { User } from '../../types/types';
import { ResetPassword } from '../../types/resetPassword';


const RedefinirSenha = () => {

    const navigation = useNavigation<StackTypes>();
    const userService = new UserService();
    const [token, setToken] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaN, setSenhaN] = useState('');
    const [message, setMessage] = useState('');

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleSubmit = async () => {
        if (senha !== senhaN) {
            setMessage('As senhas não coincidem.');
            setTimeout(() => {
                setMessage('');
            }, 3000);
            return;
        }
        
        try {
            const reset: ResetPassword = {
                token: token,
                password: senha,
              };
            const response = await userService.resetPassword(reset)
            if (response) {
                setMessage('Senha redefinida com sucesso!');
                navigation.navigate('Login');
            } else {
                setMessage('Erro ao redefinir senha.');
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            setMessage('Erro ao redefinir senha.');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Redefinir Senha</Text>

            <TextInput
                style={styles.input}
                placeholder='Senha'
                value={senha}
                onChangeText={setSenha}
            />

            <TextInput
                style={styles.input}
                placeholder='Senha novamente'
                value={senhaN}
                onChangeText={setSenhaN}
            />    

            <TextInput
                style={styles.inputToken}
                multiline={true}
                placeholder='Cole o token aqui'
                value={token}
                onChangeText={setToken}
            />  

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Redefinir</Text>
            </TouchableOpacity>

            {message && <p>{message}</p>}
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#98A62D',
    },

    title: {
        fontSize: 24,
        marginBottom: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#ffffff',
    },

    input: {
        width: '80%',
        height: 40,
        borderColor: '#49708a',
        borderWidth: 0,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
    },
                                                                                                                                                                                                    
    inputToken: {
        width: '80%',
        maxHeight: 150,
        minHeight: 40,
        borderColor: '#49708a',
        borderWidth: 0,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
    },

    button: {
        width: '80%',
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f2a622',
        backgroundColor: '#f2a622',
        marginBottom: 15,
    },

    buttonText: {
        color: '#ebf7f8',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold'
    },

    buttonSec: {
        fontFamily: 'Poppins_400Regular',
        color: '#49708a',
        marginTop: 10
    },

    labelText: {
        fontFamily: 'Poppins_400Regular',

    }
});

export default RedefinirSenha;