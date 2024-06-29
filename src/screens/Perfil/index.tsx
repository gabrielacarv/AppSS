import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import UserService from '../../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/types';
import Icon from 'react-native-vector-icons/Feather';


const Perfil = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [editable, setEditable] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const userService = new UserService();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation<StackTypes>();
  const [usernameError, setUsernameError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString !== null) {
          const userData = JSON.parse(userDataString);
          setUserData(userData);
          const response = await userService.getUserImage(userData.id);
          if (response && response.imageUrl) {
            setImageUri(response.imageUrl);
          } else {
            console.error('Resposta inválida ou URL da imagem não fornecida.');
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
      }
    };
    fetchUserData();
  }, [navigation]);


  const handleEdit = () => {
    setEditable(true);
  };

  const handleConfirm = async () => {
    if (userData !== null) {
      const success = await userService.updateUser(userData);
      if (success !== undefined) {
        if (success) {
          console.log('Usuário atualizado com sucesso!');
          alert('Usuário atualizado com sucesso!');
        } else {
          console.error('Erro ao atualizar usuário');
          alert('Erro ao atualizar usuário');
        }
      } else {
        console.error('Erro ao chamar a função updateUser');
      }
    } else {
      console.error('Dados do usuário são nulos');
    }
    setEditable(false);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.containerFormulario}>

        <Image source={imageUri ? { uri: `data:image;base64,${imageUri}` } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.imageLogo} />

        <TouchableOpacity style={styles.btnEditarImagem}>
          <Text style={styles.textbtnEditar}>Alterar Imagem</Text>
        </TouchableOpacity>

        {userData ? (
          <View style={styles.containerFormulario2}>
            <TextInput
              style={[styles.input, !editable && styles.readOnly]}
              placeholder="Nome"
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />

            <TextInput
              style={[styles.input, !editable && styles.readOnly]}
              placeholder="E-mail"
              value={userData.email}
              editable={editable}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, !editable && styles.readOnly, { flex: 1 }]}
                placeholder='Senha'
                secureTextEntry={!passwordVisible}
                value={userData.password}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="grey" />
              </TouchableOpacity>
            </View>
          </View>

        ) : (
          <Text>Nenhum usuário logado</Text>
        )}

        {editable ? (
          <TouchableOpacity style={styles.btnConfirmar} onPress={handleConfirm}>
            <Text style={styles.textbtnEditar}>Confirmar</Text>
          </TouchableOpacity>
        ) : (

          <View style={styles.containerFormulario2}>
            <TouchableOpacity style={styles.btnEditar} onPress={handleEdit}>
              <Text style={styles.textbtnEditar}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSair} onPress={() => { navigation.navigate('Login'); }}>
              <Text style={styles.textBtnSair}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2601d',
  },

  passwordContainer: {
    width: '100%',
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

  errorInput: {
    borderColor: 'red',
  },

  containerFormulario: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '90%',
    padding: 20,
    margin: 15,
  },

  containerFormulario2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '90%',
  },

  title: {
    fontSize: 30,
    marginBottom: 0,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
  },

  input: {
    width: '100%',
    height: 40,
    borderColor: '#49708a',
    borderWidth: 0,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
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

  btnSair: {
    width: '100%',
    height: 30,
    backgroundColor: '#F2441D',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },

  textBtnSair: {
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff'
  },

  btnEditarImagem: {
    width: '50%',
    height: 25,
    backgroundColor: '#F29422',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10
  },

  btnEditar: {
    width: '50%',
    height: 25,
    backgroundColor: '#F29422',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginBottom: 20
  },

  btnConfirmar: {
    width: '50%',
    height: 25,
    backgroundColor: '#4B5918',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginBottom: 20
  },

  textbtnEditar: {
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
    fontSize: 12
  },


  labelText: {
    fontFamily: 'Poppins_400Regular',
    color: '#446880',
  },

  picker: {
    height: 40,
    width: '80%',
    borderColor: '#49708a',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    fontFamily: 'Poppins_400Regular',
  },

  datePickerButton: {
    width: '80%',
    height: 40,
    borderColor: '#49708a',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },

  datePickerButtonText: {
    fontFamily: 'Poppins_400Regular',
    color: '#446880',
  },

  datePicker: {
    width: 200,
    marginBottom: 10,
  },

  buttonImg: {
    width: '50%',
    height: 40,
    backgroundColor: '#F29422',
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },

  imgPerfil: {
    width: 100,
    height: 100,
    borderRadius: 100,
    margin: 10,
  },

  imageLogo: {
    width: 140,
    height: 140,
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 100
  },

  readOnly: {
    backgroundColor: '#f2f2f2',
    color: 'gray',
  },
});

export default Perfil;