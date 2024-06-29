import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image, Alert } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as ImagePicker from 'expo-image-picker';
import UserService from '../../services/userService';
import { User } from '../../types/types'


const Cadastro = () => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation<StackTypes>();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const userService = new UserService();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const hasNumber = /\d/;
    const hasLetter = /[a-zA-Z]/;
    return password.length >= 8 && hasNumber.test(password) && hasLetter.test(password);
  };

  const handleUpload = async () => {

    if (!validateEmail(email)) {
      alert('Por favor, insira um e-mail válido.');
      console.log('email errado');
      return;
    }

    if (!validatePassword(password)) {
      alert('A senha deve ter pelo menos 8 caracteres, contendo letras e números.');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      const user: User = {
        name: name,
        email: email,
        password: password,
        photo: image
      };

      const userAdded = await userService.addUser(user);
      if (userAdded) {
        console.log('Usuário adicionado com sucesso!');
        alert('Usuário adicionado com sucesso!');
        navigation.navigate('Login');
      } else {
        console.log('Erro ao adicionar usuário');
        alert('Erro ao adicionar usuário');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>Criar conta</Text>

      <View style={styles.containerFormulario}>

        <Image source={image ? { uri: image } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.imgPerfil} />


        <TouchableOpacity style={styles.buttonImg} onPress={pickImage} >
          <Text style={styles.buttonText}>Inserir Imagem</Text>
        </TouchableOpacity>


        <TextInput
          style={styles.input}
          placeholder='Nome Completo'
          onChangeText={text => setName(text)}
          value={name}
        />

        <TextInput
          style={styles.input}
          placeholder='E-mail'
          onChangeText={text => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder='Senha'
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />

        <TextInput
          style={styles.input}
          placeholder='Confirmar senha'
          secureTextEntry={true}
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

    </View>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2a622',
  },

  containerFormulario: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '80%',
    padding: 20,
    margin: 15,
  },

  title: {
    fontSize: 30,
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
  },

  input: {
    width: '95%',
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
    borderColor: '#98A62D',
    backgroundColor: '#98A62D',
    marginBottom: 15,
  },

  buttonImg: {
    width: '45%',
    height: 30,
    backgroundColor: '#f2601d',
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 5
  },

  buttonText: {
    color: '#ebf7f8',
    fontSize: 13,
    fontFamily: 'Poppins_700Bold'
  },

  buttonSec: {
    fontFamily: 'Poppins_400Regular',
    color: '#49708a',
    marginTop: 10
  },

  labelText: {
    fontFamily: 'Poppins_400Regular',
    color: '#446880',
  },

  imgPerfil: {
    width: 100,
    height: 100,
    borderRadius: 100,
    margin: 10,
  },

  btnPefil: {
    backgroundColor: 'black',
    borderRadius: 50,
    width: '80%',
    height: 40,
  }
});

export default Cadastro;