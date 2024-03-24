import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Platform, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import GroupService from '../../services/groupService';
import { Group } from '../../types/groupType'
import * as ImagePicker from 'expo-image-picker';


const CriarGrupo = () => {

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [quant, setQuant] = useState(0);
  const [valor, setValor] = useState(0);
  const [data, setData] = useState(new Date());
  const [descricao, setDescricao] = useState('');


  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const navigation = useNavigation<StackTypes>();

  const [selectedValue, setSelectedValue] = useState<string>('');

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


    const groupService = new GroupService();

    const handleUpload = async () => {
      try {
        const group: Group = {
          idGroup: 2,
          name: name,
          maxPeople: quant,
          disclosureDate: data,
          value: valor,
          description: descricao,
          administrator: 5,
          icon: "imagem",
        };

        const createGroup = await groupService.createGroup(group);
        if (createGroup) {
          console.log('Grupo adicionado com sucesso!');
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

        {image && <Image source={{ uri: image }} style={styles.imgPerfil} />}

        <TouchableOpacity style={styles.buttonImg} onPress={pickImage} >
          <Text style={styles.buttonText}>Inserir Imagem</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder='Nome'
          onChangeText={text => setName(text)}
          value={name}
        />

        <TextInput
          style={styles.input}
          placeholder='Qtd. máxima de participantes'
          inputMode='numeric'
          onChangeText={text => setQuant(parseInt(text))} // ParseInt adicionado aqui
          value={quant.toString()} // Convertido para string
        />

        {/* <Text style={styles.labelText}>Qtd. máxima de participantes</Text>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Selecione uma opção" value="" />
        <Picker.Item label="5" value="1" />
        <Picker.Item label="10" value="2" />
        <Picker.Item label="15" value="3" />
        <Picker.Item label="20" value="4" />
        <Picker.Item label="25" value="5" />
      </Picker> */}


        <TextInput
          style={styles.input}
          placeholder='Data Revelação'
          onChangeText={text => setData(new Date())}
          value={data.toDateString()}
        />

        <TextInput
          style={styles.input}
          placeholder='Valor (R$)'
          inputMode="numeric"
          onChangeText={text => setValor(parseFloat(text))} // ParseFloat adicionado aqui
          value={valor.toString()} // Convertido para string
        />

        <TextInput
          style={styles.input}
          placeholder='Descrição'
          onChangeText={text => setDescricao(text)}
          value={descricao}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpload}>
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
      backgroundColor: 'white',
    },

    title: {
      fontSize: 30,
      marginBottom: 20,
      fontFamily: 'Poppins_700Bold',
      color: '#49708a',
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
      backgroundColor: '#a1e000',
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