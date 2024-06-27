import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import UserService from '../../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Password from 'antd/es/input/Password';
import Icon from 'react-native-vector-icons/Feather';


const Login = () => {
  const navigation = useNavigation<StackTypes>();

  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState(false);
  const [data, setData] = useState('');
  const userService = new UserService();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);


  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }


  const handleLogin = async () => {
    const autenticado = await userService.validateUser(login, password);

    if (autenticado) {
      await AsyncStorage.setItem('userData', JSON.stringify({ id: autenticado.id, email: login, name: autenticado.name, password: autenticado.password }));
      navigation.navigate('Inicial');
    } else {
      setUsernameError(true);
      console.log('Falha na autenticação. Verifique suas credenciais.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100} // Ajuste conforme necessário
    >
      <View style={styles.container}>

        <Image source={require('../../../assets/images/LogoAmarela.png')} style={styles.imageLogo} />
        <Text style={styles.title}>Entrar</Text>

        {/* <Text style={styles.labelText}>E-mail</Text> */}
        <TextInput
          style={[styles.input, usernameError && styles.errorInput]}
          placeholder='E-mail'
          onChangeText={setLogin}
          value={login}
        />

        {/* <Text style={styles.labelText}>Senha</Text> */}
        {/* <TextInput
        style={[styles.input, usernameError && styles.errorInput]}
        placeholder='Senha'
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      /> */}

        <View style={styles.passwordContainer}>
          <TextInput
            style={[ usernameError && styles.errorInput, { flex: 1 }]}
            placeholder='Senha'
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="grey" />
          </TouchableOpacity>
        </View>

        {usernameError && (
          <View style={styles.containerMensagemErro}>
            <Text style={styles.errorText}>Credenciais incorretas!</Text>
            <Text style={styles.errorText}>Por favor, verifique seu e-mail e senha.</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        // onPress={() => { navigation.navigate("Inicial"); }}
        >
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
    </KeyboardAvoidingView>

  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98A62D',
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

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
  },

  input: {
    width: '80%',
    height: 40,
    borderColor: '#ffffff',
    borderWidth: 1,
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
    borderColor: '#F29422',
    backgroundColor: '#F29422',
    marginBottom: 15,
  },

  buttonText: {
    color: '#ebf7f8',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold'
  },

  buttonSec: {
    fontFamily: 'Poppins_400Regular',
    color: 'white',
    marginTop: 10
  },

  labelText: {
    fontFamily: 'Poppins_400Regular',
    color: '#446880',
  },

  errorInput: {
    borderColor: 'red',
  },

  imageLogo: {
    width: 200,
    height: 210,
    marginBottom: 50
  },

  containerMensagemErro: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  errorText: {
    fontFamily: 'Poppins_700Bold',
    color: '#8C160B',
    marginBottom: 4,
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;