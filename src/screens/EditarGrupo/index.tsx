import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import UserService from '../../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/types';
import { Group } from '../../types/groupType'
import GroupService from '../../services/groupService';
import { TextInputMask } from 'react-native-masked-text';


const EditarGrupo = ({ route }: any) => {
    const [userData, setUserData] = useState<Group | null>(null);
    const [editable, setEditable] = useState<boolean>(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [grupo, setGrupo] = useState<Group | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [grouprData, setGroupData] = useState<Group | null>(null);
    const [inputValue, setInputValue] = useState('');


    const groupService = new GroupService();
    const userService = new UserService();
    const navigation = useNavigation<StackTypes>();


    const handleDataChange = (text: string) => {
        setInputValue(text);
    };


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);
                    setUserData(userData);
                }
            } catch (error) {
                console.error('Erro ao recuperar dados do usuário:', error);
            }
        };


        const fetchGrupo = async () => {
            try {
                const fetchedGrupo = await groupService.getGroupId(route.params.grupoId);
                if (fetchedGrupo) {
                    setGrupo(fetchedGrupo);
                    const response = await groupService.getGroupImage(route.params.grupoId);
                    if (response && response.imageUrl) {
                        setImageUri(response.imageUrl);
                    } else {
                        console.error('Resposta inválida ou URL da imagem não fornecida.');
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
        fetchUserData();
        fetchGrupo();
    }, []);

    useEffect(() => {
        if (grupo && typeof grupo.disclosureDate === 'string') {
            setInputValue(new Date(grupo.disclosureDate).toLocaleDateString('pt-BR'));
        }
    }, [grupo]);


    const handleEdit = () => {
        setEditable(true);
    };

    const handleConfirm = async () => {
        if (grupo !== null) {
            const success = await groupService.updateGroup(grupo);
            if (success !== undefined) {
                if (success) {
                    console.log('Grupo atualizado com sucesso!');
                    alert('Grupo atualizado com sucesso!');
                } else {
                    console.error('Erro ao atualizar grupo');
                    alert('Erro ao atualizar grupo');
                }
            } else {
                console.error('Erro ao chamar a função updateGroup');
            }
        } else {
            console.error('Dados do grupo são nulos');
        }
        setEditable(false);
    };

    const handleDelete = async () => {
        if (grupo?.idGroup) {
            const result = await groupService.deleteGroup(grupo.idGroup);
            if (result) {
                alert('Grupo excluído com sucesso.');
                navigation.navigate('Inicial');
            } else {
                alert('Erro ao excluir o grupo.');
            }
        }
    };

    const isValidDate = (dateString: string): boolean => {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        return dateRegex.test(dateString);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Grupo</Text>

            <View style={styles.containerFormulario}>

                <Image source={imageUri ? { uri: `data:image;base64,${imageUri}` } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.imageLogo} />

                <TouchableOpacity>
                    <Text>Alterar Icone</Text>
                </TouchableOpacity>

                {grupo ? (
                    <View style={styles.containerFormulario2}>
                        <TextInput
                            style={[styles.input, !editable && styles.readOnly]}
                            placeholder="Nome"
                            value={grupo?.name}
                            onChangeText={(text) => setGrupo({ ...grupo, name: text })}
                        />

                        <TextInput
                            style={[styles.input, !editable && styles.readOnly]}
                            placeholder="Máx. Pessoas"
                            value={grupo?.maxPeople.toString()}
                            editable={editable}
                            onChangeText={(text) => setGrupo({ ...grupo, maxPeople: parseInt(text) || 0 })}
                        />

                        <TextInputMask
                            style={[styles.input, !editable && styles.readOnly]}
                            placeholder="Data Revelação"
                            value={inputValue}
                            editable={editable}

                            onChangeText={(text) => {
                                setInputValue(text);
                                if (isValidDate(text)) {
                                    const [day, month, year] = text.split('/').map(Number);
                                    const date = new Date(year, month - 1, day);
                                    setGrupo({ ...grupo, disclosureDate: date });
                                } else {

                                }
                            }}
                            type={'datetime'}
                            options={{
                                format: 'DD/MM/YYYY',
                            }}
                        />

                        <TextInput
                            style={[styles.input, !editable && styles.readOnly]}
                            placeholder="Valor"
                            value={grupo?.value.toString()}
                            editable={editable}
                            onChangeText={(text) => setGrupo({ ...grupo, maxPeople: parseInt(text) || 0 })}
                        />

                        <TextInput
                            style={[styles.inputDesc, !editable && styles.readOnly]}
                            placeholder="Descrição"
                            value={grupo?.description}
                            editable={editable}
                            multiline={true}
                            onChangeText={(text) => setGrupo({ ...grupo, description: text })}
                        />
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
                        <TouchableOpacity style={styles.btnSair} onPress={handleDelete}>
                            <Text style={styles.textBtnSair}>Excluir</Text>
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

    btnConfirmar: {
        width: '50%',
        height: 25,
        backgroundColor: '#98A62D',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginBottom: 20,
        marginTop: 10,
    },

    btnEditar: {
        width: '50%',
        height: 25,
        backgroundColor: '#f2a622',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginBottom: 20,
        marginTop: 10,
    },

    textbtnEditar: {
        fontFamily: 'Poppins_700Bold',
        color: '#ffffff',
        fontSize: 12
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

    inputDesc: {
        width: '95%',
        height: 107,
        borderColor: '#49708a',
        borderWidth: 0,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
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
        backgroundColor: '#f2f2f2',
        color: 'gray',
    },
});

export default EditarGrupo;