import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Group } from '../../types/groupType';
import GroupService from '../../services/groupService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/types';

const Notificacao = () => {
  const navigation = useNavigation<StackTypes>();
  const [grupos, setGrupos] = useState<Group[]>([]);
  const groupService = new GroupService();
  const [userData1, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString !== null) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);
          if (parsedUserData?.id) {
            const fetchedGrupo = await groupService.GetGroupsPendingByUser(parsedUserData.id);
            if (fetchedGrupo) {
              setGrupos(fetchedGrupo);
            } else {
              setError('Usuário não encontrado.');
            }
          } else {
            setError('Usuário não encontrado.');
          }
        } else {
          setError('Usuário não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setError('Erro ao buscar usuário. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrupo();
  }, [grupos]);

  return (
    <View style={styles.containerGeral}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Notificação</Text>

        <ScrollView style={styles.container1} contentContainerStyle={{ justifyContent: 'center', paddingRight: 0, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
          {grupos.map((grupo) => (
            <TouchableOpacity key={grupo.idGroup} style={styles.containerGrupo} onPress={() => { navigation.navigate("DetalhesNotificacao", { grupoId: grupo.idGroup }); }}>
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
    width: '90%',
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
    marginRight: 10,
    padding: 5
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
    width: 300,
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
    backgroundColor: '#98A62D',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'center',
  },

});
export default Notificacao;