import React, { useState, useEffect  } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image, ScrollView, SafeAreaView  } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Group } from '../../types/groupType'


 const BASE_URL = 'https://localhost:7186/api/Group/GetGroups'


// const Inicial = () => {

//   const navigation = useNavigation<StackTypes>();

//   const [fontsLoaded] = useFonts({
//     Poppins_400Regular,
//     Poppins_700Bold,
//   });

//   if (!fontsLoaded) {
//     return null;
//   }

//   const [grupos, setGrupos] = useState<Group[]>([]);

//   useEffect(() => {
//     // Aqui você irá buscar os grupos do seu banco de dados ou API e atualizar o estado 'grupos'
//     const fetchGrupos = async () => {
//       // Exemplo de como buscar grupos de uma API fictícia
//       try {
//         const response = await fetch(BASE_URL);
//         const data = await response.json();
//         setGrupos(data); 
//       } catch (error) {
//         console.error('Erro ao buscar grupos:', error);
//       }
//     };

//     fetchGrupos();
//   }, []); 

//   return (
//     // <View style={styles.container}>
//     //   <Text style={styles.title}>INCIAL</Text>

//     //   <TouchableOpacity style={styles.containerGrupo}>
//     //     <Image source={require('../../../assets/images/Perfil_Grupo.png')} style={styles.icon} />
//     //     <Text style={styles.Text}>Nome Grupo</Text>
//     //     <Text style={styles.Text}>Quant. (0/10)</Text>
//     //   </TouchableOpacity>
//     // </View>

//     <View style={styles.container}>
//       <Text style={styles.title}>INICIAL</Text>

//       {grupos.map((grupo) => (
//         <TouchableOpacity key={grupo.id} style={styles.containerGrupo}>
//           <Image source={{ uri: grupo.Icon }} style={styles.icon} />
//           <Text style={styles.Text}>{grupo.name}</Text>
//           <Text style={styles.Text}>{`Quant. (/${grupo.MaxPeople})`}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };





const Inicial = () => {
  const navigation = useNavigation<StackTypes>();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [grupos, setGrupos] = useState<Group[]>([]);

  // useEffect(() => {
  //   const loadFonts = async () => {
  //     try {
  //       await useFonts({
  //         Poppins_400Regular,
  //         Poppins_700Bold,
  //       });
  //       setFontsLoaded(true);
  //     } catch (error) {
  //       console.error('Erro ao carregar as fontes:', error);
  //     }
  //   };

  //   loadFonts();
  // }, []);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error('Erro ao buscar grupos');
        }
        const data = await response.json();
        setGrupos(data);
      } catch (error) {
        console.error('Erro ao buscar grupos:', error);
        // Trate o erro de forma apropriada (ex: exibindo uma mensagem de erro para o usuário)
      }
    };

    fetchGrupos();
  }, []);

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>INICIAL</Text>

      <TouchableOpacity style={styles.btnCriarGrupo} onPress={() => { navigation.navigate("CriarGrupo"); }}>
        <Text>Criar grupo</Text>
      </TouchableOpacity>
      <ScrollView style={styles.container1}>
      {grupos.map((grupo) => (
        <TouchableOpacity key={grupo.idGroup} style={styles.containerGrupo}>
          <Image source={grupo.icon ? { uri: `data:image/jpeg;base64,${grupo.icon}` } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.icon} />
          <Text style={styles.Text}>{grupo.name}</Text>
          <Text style={styles.Text}>{grupo.idGroup}</Text>
          <Text style={styles.Text}>{`Quant. ${grupo.maxPeople}`}</Text>
        </TouchableOpacity>
        
      ))}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
  },

  container1: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#49708a',
  },

  input: {
    width: '80%',
    height: 40,
    borderColor: '#49708a',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
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

  },

  containerGrupo: {
    width: '80%',
    height: 70,
    padding: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection: 'row',
    margin: 10,
  },

  Text: {
    color: 'black',
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
    borderRadius: 0,
    // padding: 10,
  },

  btnCriarGrupo:{
    width: 60,
    height: 40,
    padding: 0,
    alignItems: 'center',
    backgroundColor: '#ebf7f8',
    borderRadius: 10,
    flexDirection: 'row',
    margin: 10,
  },
  
});
export default Inicial;