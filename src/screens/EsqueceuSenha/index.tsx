import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import axios from 'axios';
import UserService from '../../services/userService';
import { User } from '../../types/types';
import { ActivityIndicator } from 'react-native';


const EsqueceuSenha = () => {

  const navigation = useNavigation<StackTypes>();
  const userService = new UserService();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await userService.requestPasswordReset(email);
      if (response) {
        alert('Email de recuperação enviado. Verifique sua caixa de entrada.');
        navigation.navigate('RedefinirSenha');
      } else {
        setMessage('Erro ao enviar email de recuperação.');
      }
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      alert('Erro ao enviar email de recuperação.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder='E-mail'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size='small' color='#ffffff' />
        ) : (
          <Text style={styles.buttonText}>Enviar e-mail</Text>
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

export default EsqueceuSenha;