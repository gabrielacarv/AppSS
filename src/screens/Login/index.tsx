import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import UserService from '../../services/userService';

const Login = () => {
  const navigation = useNavigation<StackTypes>();

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState(false);

  const userService = new UserService();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {

    if (!login) {
      setUsernameError(true);
      return;
    } else {
      setUsernameError(false);
    }

    const isValid = await userService.validateUser(login, password);
    alert(isValid);
    if (isValid) {
      alert('Usuário autenticado com sucesso');
      //Alert.alert('Sucesso', 'Usuário autenticado com sucesso');
      setLogin('');
      setPassword('');
    } else {
      alert('Usuário e/ou senha inválidos');
      //Alert.alert('Erro', 'Usuário e/ou senha inválidos');
    }
  };

  return (

    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      {/* <Text style={styles.labelText}>E-mail</Text> */}
      <TextInput
        style={[styles.input, usernameError && styles.errorInput]} // Aplicar estilo de erro se usernameError for true
        placeholder='E-mail'
        onChangeText={setLogin}
        value={login}
      />

      {/* <Text style={styles.labelText}>Senha</Text> */}
      <TextInput
        style={styles.input}
        placeholder='Senha'
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity
        style={styles.button}
        // onPress={handleLogin}
        onPress={() => { navigation.navigate("Inicial"); }}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        navigation.navigate('Cadastro');
      }}>
        <Text style={styles.buttonSec}>Cadastra-se</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { navigation.navigate("EsqueceuSenha"); }} >
        <Text style={styles.buttonSec}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {/* <Button title='Ir para Home'/> */}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#49708a',  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#49708a',
    borderWidth: 0,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor:'#f0f0f0',
  },
  button: {
    width: '80%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a1e000',
    backgroundColor: '#a1e000',
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
    color: '#446880',
  },
  errorInput: {
    borderColor: 'red', // Alterar a cor da borda para vermelho se houver erro
  },
});

export default Login;