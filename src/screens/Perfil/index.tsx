import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import UserService from '../../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/types';


// const Perfil = () => {
//     const [userData, setUserData] = useState<User | null>(null); // fornecer um tipo explícito para userData

//     useEffect(() => {
//         const fetchUserData = async () => {
//           try {
//             const userDataString = await AsyncStorage.getItem('userData');
//             if (userDataString !== null) {
//               setUserData(JSON.parse(userDataString));
//             }
//           } catch (error) {
//             console.error('Erro ao recuperar dados do usuário:', error);
//           }
//         };

//         fetchUserData();
//       }, []);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Perfil</Text>

//             <View style={styles.containerFormulario}>
//                 {/* <Image source={require('../../../assets/images/perfil.png')} style={styles.imageLogo} /> */}
//                 <Image source={userData?.photo? { uri: `data:image/jpeg;base64,${userData?.photo}` } : require('../../../assets/images/Perfil_Grupo.png')}style={styles.imageLogo} />

//                 <TouchableOpacity>
//                     <Text>Alterar Imagem</Text>
//                 </TouchableOpacity>

//                 {userData ? (
//                     <View style={styles.containerFormulario2}>
//                         <TextInput
//                             style={styles.input}
//                             placeholder='Nome'
//                             value={userData.name}
//                             readOnly
//                         />

//                         <TextInput
//                             style={styles.input}
//                             placeholder='E-mail'
//                             value={userData.email}
//                             readOnly
//                         />

//                         <TextInput
//                             style={styles.input}
//                             placeholder='Senha'
//                             value={userData.password}
//                             secureTextEntry={true}
//                             readOnly
//                         />
//                     </View>
//                 ) : (
//                     <Text>Nenhum usuário logado</Text>
//                 )}

//                 <TouchableOpacity>
//                     <Text>Editar</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>

//     );
// };
const Perfil = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [editable, setEditable] = useState<boolean>(false); // Adicionando estado para controlar a edição dos campos
  const [nome, setNome] = useState<string>('');
  const userService = new UserService();
  const [imageUri, setImageUri] = useState<string | null>(null);


  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userDataString = await AsyncStorage.getItem('userData');
  //       if (userDataString !== null) {
  //         setUserData(JSON.parse(userDataString));
  //       }
  //     } catch (error) {
  //       console.error('Erro ao recuperar dados do usuário:', error);
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userDataString = await AsyncStorage.getItem('userData');
  //       if (userDataString !== null) {
  //         const userData = JSON.parse(userDataString);
  //         setUserData(userData);
  //         const userImage = await userService.getUserImage(10);
  //         if (userImage) {
  //           setImageUri(userImage.imageData); // Supondo que o objeto UserImage tenha uma propriedade 'url' que contenha o URL da imagem
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Erro ao recuperar dados do usuário:', error);
  //     }
  //   };
  //   fetchUserData();
  //   loadUserImage();
  // }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString !== null) {
          const userData = JSON.parse(userDataString);
          setUserData(userData);
          const response = await userService.getUserImage(userData.id); // Verifique se o ID do usuário está correto
          if (response && response.imageUrl) {
            setImageUri(response.imageUrl); // Use a propriedade correta 'ImageUrl'
          } else {
            console.error('Resposta inválida ou URL da imagem não fornecida.');
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
      }
    };
    fetchUserData();
  }, []);


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

        <TouchableOpacity>
          <Text>Alterar Imagem</Text>
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

            <TextInput
              style={[styles.input, !editable && styles.readOnly]}
              placeholder="Senha"
              value={userData.password}
              secureTextEntry={true}
              editable={editable}
            />
          </View>
        ) : (
          <Text>Nenhum usuário logado</Text>
        )}

        {editable ? (
          // Botão para confirmar as alterações quando estiver em modo de edição
          <TouchableOpacity onPress={handleConfirm}>
            <Text>Confirmar</Text>
          </TouchableOpacity>
        ) : (
          // Botão para iniciar a edição dos campos
          <TouchableOpacity onPress={handleEdit}>
            <Text>Editar</Text>
          </TouchableOpacity>
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
    // borderRadius: 8,
    width: '90%',
    // padding: 20,
    // margin: 15,
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
    // Estilos para os campos em modo de leitura (não editáveis)
    backgroundColor: '#f2f2f2', // Um fundo cinza claro
    color: 'gray', // Texto cinza
  },
});

export default Perfil;