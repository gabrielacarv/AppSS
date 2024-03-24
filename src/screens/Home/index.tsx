import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';


const Home = () => {

    const navigation = useNavigation<StackTypes>();

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
    return null;
    }

return (
    <View style={styles.container}>
        
        <Image source={require('../../../assets/images/Logo2.png')} style={styles.image} />
        {/* <Text style={styles.title}>Sorteio Secreto</Text> */}

        <TouchableOpacity
            style={styles.button}  
            onPress={() => {navigation.navigate('Login');}}>
        <Text style={styles.buttonText}>Entrar</Text>       
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.button}  
            onPress={() => {navigation.navigate('Cadastro');}}>
        <Text style={styles.buttonText}>Cadastrar-se</Text>       
        </TouchableOpacity>
    </View>
);
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },

    greeting: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 16,
    },

    buttonsContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },

    title: {
        fontSize: 24,
        marginBottom: 50,
        fontFamily: 'Poppins_700Bold',
        color: '#446880',
      },

      button: {
        width: '80%',
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a1e000',
        backgroundColor: '#96D311',
        marginBottom: 15,
      },

      buttonText: {
        color: '#ebf7f8',
        fontSize: 16,
        fontFamily: 'Poppins_700Bold'
      },

      image:{
        width: 298, 
        height: 151.5,
        marginBottom: 90 
      }
    
  });

export default Home;