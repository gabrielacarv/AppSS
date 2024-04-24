import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image } from 'react-native';
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

  const navigation = useNavigation<StackTypes>();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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

  const handleUpload = async () => {
    try {
      const user: User = {
        id: 2,
        name: name,
        email: email,
        password: password,
        photo: "image"
      };

      const userAdded = await userService.addUser(user);
      if (userAdded) {
        console.log('Usuário adicionado com sucesso!');
      } else {
        console.log('Erro ao adicionar usuário');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>Criar conta</Text>

      <View style={styles.containerFormulario}>

        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '80%',height: 100, borderRadius: 50}}> */}
        {/* {image && <Image source={{ uri: image }} style={styles.imgPerfil} />} */}
        <Image source={image ? { uri: image } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.imgPerfil} />


        <TouchableOpacity style={styles.buttonImg} onPress={pickImage} >
          <Text style={styles.buttonText}>Inserir Imagem</Text>
        </TouchableOpacity>


        {/* <Text style={styles.labelText}>Nome</Text> */}
        <TextInput
          style={styles.input}
          placeholder='Nome Completo'
          onChangeText={text => setName(text)}
          value={name}
        />

        {/* <Text style={styles.labelText}>E-mail</Text> */}
        <TextInput
          style={styles.input}
          placeholder='E-mail'
          onChangeText={text => setEmail(text)}
          value={email}
        />

        {/* <Text style={styles.labelText}>Senha</Text> */}
        <TextInput
          style={styles.input}
          placeholder='Senha'
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />

        {/* <Text style={styles.labelText}>Confirmar Senha</Text> */}
        <TextInput
          style={styles.input}
          placeholder='Confirmar senha'
          secureTextEntry={true}
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
    width: '40%',
    height: 30,
    backgroundColor: '#8c320b',
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
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