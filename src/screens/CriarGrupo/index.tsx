import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Platform, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import GroupService from '../../services/groupService';
import { Group } from '../../types/groupType'
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInputMask } from 'react-native-masked-text';
import NumberFormat from 'react-number-format';
import { User } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../../services/userService';




const CriarGrupo = () => {

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [quant, setQuant] = useState('');
  const [valor, setValor] = useState<number>(0.0);
  const [data, setData] = useState<Date>(new Date());
  const [descricao, setDescricao] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [userData, setUserData] = useState<User | null>(null);
  const [administratorID, setadministratorID] = useState('');
  const groupService = new GroupService();

  const navigation = useNavigation<StackTypes>();

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (userDataString !== null) {
                const userData = JSON.parse(userDataString);
                setUserData(userData);
                console.log(userData)
            }
        } catch (error) {
            console.error('Erro ao recuperar dados do usuário:', error);
        }
    };
    fetchUserData();
}, []);

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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  
  const handleDataChange = (text: string) => {
    setInputValue(text);
    const date = new Date(text);
    setData(date);
  };


  const handleChange = (text: string) => {
    setInputValue2(text); 
    const cleanedText = text.replace('R$', '').trim();
    // const cleanedText = text.replace('R$', '').replace(',', '.').trim();
    const floatValue = parseFloat(cleanedText);
    setValor(floatValue);
};

  const handleUpload = async () => {
    try {
      const group: Group = {
        idGroup: 2,
        name: name,
        maxPeople: parseInt(quant),
        disclosureDate: data,
        value: valor,
        description: descricao,
        administrator: userData?.id ? userData?.id : 0,
        icon: image,
      };

      const createGroup = await groupService.createGroup(group);
      if (createGroup) {
        console.log('Grupo adicionado com sucesso!');
        navigation.navigate('Inicial');
      } else {
        console.log('Erro ao adicionar grupo');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Grupo</Text>


      <View style={styles.containerFormulario}>

        {/* {image && <Image source={{ uri: image }} style={styles.imgPerfil} />} */}
        <Image source={image ? { uri: image } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.imgPerfil} />


        <TouchableOpacity style={styles.buttonImg} onPress={pickImage} >
          <Text style={styles.buttonText}>Inserir Icone</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder='Nome'
          onChangeText={text => setName(text)}
          value={name}
        />

        <TextInput
          style={styles.input}
          placeholder='Máx. de participantes'
          inputMode='numeric'
          onChangeText={text => setQuant(text)} // ParseInt adicionado aqui
          value={quant} // Convertido para string
        />

        <TextInputMask
          style={styles.input}
          type={'datetime'}
          options={{
            format: 'DD/MM/YYYY',
          }}
          placeholder='Data Revelação'
          onChangeText={handleDataChange}
          value={inputValue}
        />

        {/* <TextInput
          style={styles.input}
          placeholder='Valor (R$)'
          inputMode="numeric"
          onChangeText={text => setValor(parseFloat(text))}
          value={valor.toString()}
        /> */}

        <TextInputMask
          style={styles.input}
          type={'money'}
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$ ',
          }}
          placeholder='Valor (R$)'
          onChangeText={handleChange}
          value={inputValue2}
        />


        {/* <TextInputMask
  style={styles.input}
  placeholder='Valor (R$)'
  type={'money'}
  options={{
    precision: 2,
    separator: ',',
    delimiter: '.',
    unit: 'R$ ',
  }}
  value={inputValue2}
  onChangeText={handleChange}
/> */}


        {/* <TextInputMask
  style={styles.input}
  placeholder='Valor (R$)'
  type={'money'}
  options={{
    precision: 2,
    separator: ',',
    delimiter: '.',
    unit: 'R$ ',
  }}
  value={inputValue2}
  onChangeText={(formatted, inputValue2) => {
    setInputValue2(formatted); // Atualiza o estado inputValue2 com o valor formatado
    setValor(inputValue2 ? parseFloat(inputValue2) : 0); // Atualiza o estado valor com o valor sem formatação
  }}
/> */}

        <TextInput
          style={styles.input}
          placeholder='Descrição'
          onChangeText={text => setDescricao(text)}
          value={descricao}
        />

      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpload} >
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>


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
    width: '35%',
    height: 30,
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
});

export default CriarGrupo;