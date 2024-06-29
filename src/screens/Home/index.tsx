import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Image, Pressable } from 'react-native';
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

      <Image source={require('../../../assets/images/LogoAmarela.png')} style={styles.imageLogo} />

      <View style={styles.containerSubTitle}>
        <Text style={styles.subTitle}>Junte-se a nós, crie grupos, reúna a galera e divirta-se!</Text>
        <Image source={require('../../../assets/images/Mascote1.png')} style={styles.imageMascote} />
      </View>

      <Pressable
        style={styles.button}
        onPress={() => { navigation.navigate('Login'); }}>
        <Text style={styles.buttonText}>Participar</Text>
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2601d',
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
    color: '#ffffff',
  },

  subTitle: {
    fontSize: 17,
    marginBottom: 0,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
  },

  containerSubTitle: {
    flexDirection: 'row',
    padding: 25,
    alignItems: 'center',
    gap: 40,
    marginRight: 60,
    marginLeft: 30,
  },

  button: {
    width: '80%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#98A62D',
    backgroundColor: '#98A62D',
    marginBottom: 15,
  },

  buttonText: {
    color: '#ebf7f8',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold'
  },

  imageLogo: {
    width: 200,
    height: 210,
    marginBottom: 50
  },

  imageMascote: {
    width: 100,
    height: 150,
  },

});

export default Home;