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
import InvitationService from '../../services/invitationService';
import { Invitation } from '../../types/invitationType';

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
  const invitationService = new InvitationService();
  const [grupos, setGrupos] = useState<Group[]>([]);

  const navigation = useNavigation<StackTypes>();
  const BASE_URL = 'https://localhost:7186/api/Group/GetGroupsByUser/'

  useEffect(() => {

    const fetchGrupos = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');

        if (userDataString !== null) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);

          if (parsedUserData.id) { // Verifica se id está definido
            const response = await fetch(BASE_URL + parsedUserData.id);

            if (!response.ok) {
              throw new Error('Erro ao buscar grupos');
            }

            const data = await response.json();
            setGrupos(data);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar grupos:', error);
      }
    };

    fetchGrupos();
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
    const floatValue = parseFloat(cleanedText);
    setValor(floatValue);
  };

  const handleUpload = async () => {
    try {
      if (!userData) {
        throw new Error('Usuário não encontrado.');
      }

      const group: Group = {
        name: name,
        maxPeople: parseInt(quant),
        disclosureDate: data,
        value: valor,
        description: descricao,
        administrator: userData.id ? userData.id : 0,
        icon: image,
      };

      const createGroup = await groupService.createGroup(group);

      if (createGroup) {
        console.log('Grupo adicionado com sucesso!');

        const grupos = await groupService.getGroupsByUserAdmin(userData.id ? userData.id : 0);

        console.log('Grupos retornados:', grupos);

        if (grupos && grupos.length > 0) {
          const lastGroup = grupos[grupos.length - 1];
          console.log('Último grupo retornado:', lastGroup);

          const invitation = {
            groupId: lastGroup.idGroup ? lastGroup.idGroup : 0,
            recipientId: userData.id ? userData.id : 0,
            senderId: userData.id ? userData.id : 0,
            status: 'aceito',
          };

          await invitationService.createInvitation(invitation);
          console.log('Convite enviado com sucesso!');
          navigation.navigate('Inicial');
        } else {
          console.error('Nenhum grupo encontrado para o usuário.');
        }
      } else {
        console.log('Erro ao adicionar grupo');
      }
    } catch (error) {
      console.error('Erro ao adicionar grupo:', error);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Grupo</Text>


      <View style={styles.containerFormulario}>

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
          onChangeText={text => setQuant(text)}
          value={quant}
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