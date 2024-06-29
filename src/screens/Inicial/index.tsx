import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Group } from '../../types/groupType'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/types';


const BASE_URL = 'https://localhost:7186/api/Group/GetGroupsByUser/'

const Inicial = () => {
  const navigation = useNavigation<StackTypes>();
  const isFocused = useIsFocused();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [grupos, setGrupos] = useState<Group[]>([]);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');

        if (userDataString !== null) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);

          if (parsedUserData.id) {
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
  }, [isFocused, navigation]);


  return (

    <View style={styles.containerGeral}>
      <View style={styles.containerBtnsSuperiores}>
        <View style={styles.containerBtnPefilUsuario}>
          <TouchableOpacity style={styles.btnPerfilUsuario} onPress={() => { navigation.navigate("Notificacao"); }}>
            <Image source={require('../../../assets/images/sino.png')} style={styles.image} />
          </TouchableOpacity>
        </View>
        <View style={styles.containerBtnPefilUsuario}>
          <TouchableOpacity style={styles.btnPerfilUsuario} onPress={() => { navigation.navigate("Perfil"); }}>
            <Image source={require('../../../assets/images/perfil.png')} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>

      <SafeAreaView style={styles.container}>

        <Text style={styles.title}>Grupos</Text>

        <View style={styles.containerBtnCriarGrupo}>
          <TouchableOpacity style={styles.btnCriarGrupo} onPress={() => { navigation.navigate("CriarGrupo"); }}>
            <Text style={styles.btnCriarGrupoText}>+ Grupo</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container1} contentContainerStyle={{ justifyContent: 'center', paddingRight: 0, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
          {grupos.map((grupo) => (
            <TouchableOpacity key={grupo.idGroup} style={styles.containerGrupo} onPress={() => { navigation.navigate("DetalhesGrupo", { grupoId: grupo.idGroup }); }}>
              <View style={styles.infoPrincipalGrupo} >
                <Image source={grupo.icon ? { uri: `data:image;base64,${grupo.icon}` } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.icon} />
                <Text style={styles.Text}>{grupo.name}</Text>
              </View>
            </TouchableOpacity>

          ))}
        </ScrollView>

      </SafeAreaView>
    </View>
  );
};


const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
  },
  containerGeral: {
    flex: 1,
    backgroundColor: 'white',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },

  container1: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: 'white',
  },

  infoPrincipalGrupo: {
    flexDirection: 'row',
    gap: 25,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#49708a',
  },

  containerBtnCriarGrupo: {
    justifyContent: 'flex-end',
  },

  containerBtnPefilUsuario: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    marginRight: 15,
    marginLeft: 15,
    padding: 5
  },

  containerBtnsSuperiores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  },

  containerGrupo: {
    width: '80%',
    height: 70,
    paddingRight: 30,
    paddingLeft: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F29422',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 10,
  },

  Text: {
    color: '#ffffff',
    fontFamily: 'Poppins_400Regular',
  },

  imgPerfil: {
    width: 150,
    height: 150,
    borderRadius: 100,
    margin: 10,
  },

  icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    borderWidth: 0,
    borderColor: '#a1e000',
    borderRadius: 5,
  },

  btnCriarGrupo: {
    width: 310,
    height: 35,
    padding: 0,
    alignItems: 'center',
    backgroundColor: '#98A62D',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'center',
  },

  btnCriarGrupoText: {
    color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins_700Bold'
  },

  btnPerfilUsuario: {
    width: 30,
    height: 35,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f2601d',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'center',
  },

});
export default Inicial;