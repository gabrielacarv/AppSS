import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import axios from 'axios';
import UserService from '../../services/userService';
import { User } from '../../types/types';
import { ResetPassword } from '../../types/resetPassword';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


const RedefinirSenha = () => {

    const navigation = useNavigation<StackTypes>();
    const userService = new UserService();
    const [token, setToken] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaN, setSenhaN] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [usernameError, setUsernameError] = useState(false);

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const validatePassword = (password: string) => {
        const hasNumber = /\d/;
        const hasLetter = /[a-zA-Z]/;
        return password.length >= 8 && hasNumber.test(password) && hasLetter.test(password);
      };

    const handleSubmit = async () => {
        if (senha !== senhaN) {
            alert('As senhas não coincidem.');
            setTimeout(() => {
                setMessage('');
            }, 3000);
            return;
        }

        if (!validatePassword(senha)) {
            alert('A senha deve ter pelo menos 8 caracteres, contendo letras e números.');
            return;
          }

        setLoading(true); // Ativa a animação de carregamento
        
        try {
            const reset: ResetPassword = {
                token: token,
                password: senha,
              };
            const response = await userService.resetPassword(reset)
            if (response) {
                alert('Senha redefinida com sucesso!');
                navigation.navigate('Login');
            } else {
                alert('Erro ao redefinir senha.');
            }
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            alert('Erro ao redefinir senha.');
        } finally {
            setLoading(false); // Desativa a animação de carregamento após o processamento
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Redefinir Senha</Text>

            {/* <TextInput
                style={styles.input}
                placeholder='Senha'
                value={senha}
                onChangeText={setSenha}
            /> */}

            <View style={styles.passwordContainer}>
            <TextInput
                style={[ usernameError && styles.errorInput, { flex: 1 }]}
                placeholder='Senha'
                secureTextEntry={!passwordVisible}
                onChangeText={setSenha}
                value={senha}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="grey" />
            </TouchableOpacity>
            </View>

            {/* <TextInput
                style={styles.input}
                placeholder='Senha novamente'
                value={senhaN}
                onChangeText={setSenhaN}
            />     */}

            <View style={styles.passwordContainer}>
            <TextInput
                style={[ usernameError && styles.errorInput, { flex: 1 }]}
                placeholder='Senha'
                secureTextEntry={!passwordVisible}
                onChangeText={setSenhaN}
                value={senhaN}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="grey" />
            </TouchableOpacity>
            </View>

            <TextInput
                style={styles.inputToken}
                multiline={false}
                placeholder='Cole o token aqui'
                value={token}
                onChangeText={setToken}
            />  

            {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Redefinir</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size='small' color='#ffffff' /> // Mostra a animação de carregamento se estiver carregando
                ) : (
                    <Text style={styles.buttonText}>Redefinir</Text>
                )}
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
    errorInput: {
        borderColor: 'red',
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

    passwordContainer: {
        width: '80%',
        height: 40,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
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