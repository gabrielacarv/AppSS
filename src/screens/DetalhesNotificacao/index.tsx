import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Touchable, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Group } from '../../types/groupType'
import GroupService from '../../services/groupService';
import { User } from '../../types/types';
import TextArea from 'antd/es/input/TextArea';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InvitationService from '../../services/invitationService';
import { Invitation } from '../../types/invitationType';
import UserService from '../../services/userService';
import { ActivityIndicator } from 'react-native';


const DetalhesNotificacao = ({ route }: any) => {
    const navigation = useNavigation<StackTypes>();
    const [userData, setUserData] = useState<User | null>(null);
    const [grupo, setGrupo] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [participante, setparticipante] = useState<User | null>(null);
    const [newParticipantEmail, setNewParticipantEmail] = useState('');
    const [grupoId, setgrupoId] = useState(0);
    const [remetenteId, setRemetenteId] = useState(0);

    const groupService = new GroupService();
    const invitationService = new InvitationService();
    const userService = new UserService();

    const isFocused = useIsFocused();

    const [expanded, setExpanded] = useState(false);


    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const RecusarConvite = async (id: number, recipientId: number) => {
        try {
            await invitationService.updateStatus(id, 'Recusado', recipientId);
            alert('Convite recusado com sucesso');
            navigation.navigate("Notificacao");
        } catch (error) {
            console.error('Erro ao recusar convite:', error);
            alert('Erro ao recusar convite. Tente novamente mais tarde.');
        }
    };

    const AceitarConvite = async (id: number, recipientId: number) => {
        try {
            await invitationService.updateStatus(id, 'Aceito', recipientId);
            alert('Convite aceito com sucesso');
            navigation.navigate("Notificacao");
        } catch (error) {
            console.error('Erro ao aceitar convite:', error);
            alert('Erro ao aceitar convite. Tente novamente mais tarde.');
        }
    };

    useEffect(() => {
        const fetchGrupo = async () => {
            try {
                const fetchedGrupo = await groupService.getGroupId(route.params.grupoId);
                console.log('Fetched Group:', fetchedGrupo);
                if (fetchedGrupo) {
                    setGrupo(fetchedGrupo);
                } else {
                    setError('Grupo não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar grupo:', error);
                setError('Erro ao buscar grupo. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        const fetchParticipantes = async () => {
            try {
                const fetchedParticipantes = await groupService.GetParticipantsByGroup(route.params.grupoId);
                console.log('Fetched Participants:', fetchedParticipantes);
                if (fetchedParticipantes) {
                    setparticipante(fetchedParticipantes);
                } else {
                    setError('Participantes não encontrados.');
                }
            } catch (error) {
                console.error('Erro ao buscar participantes:', error);
                setError('Erro ao buscar participantes. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);
                    setUserData(userData);
                    console.log('User Data:', userData);
                }
            } catch (error) {
                console.error('Erro ao recuperar dados do usuário:', error);
            }
        };

        fetchGrupo();
        fetchUserData();
        fetchParticipantes();
    }, [route.params.grupoId, isFocused, navigation]);


    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.containerCarregamento}>
                    <ActivityIndicator size="large" color="#49708a" />
                </View>
            ) : error ? (
                <Text>{error}</Text>
            ) : grupo ? (
                <>
                    <ScrollView contentContainerStyle={{ justifyContent: 'center', paddingRight: 0, alignItems: 'center' }}>
                        {participante && Array.isArray(participante) && participante.length > 0 && (
                            <View style={styles.container1}>
                                <Text style={styles.title}>Grupo</Text>
                                <TouchableOpacity key={grupo.idGroup} style={[styles.containerGrupo, expanded && styles.expandedContainerGrupo]} onPress={toggleExpand}>
                                    <View style={[styles.infoPrincipalGrupo, expanded && styles.expandedInfoPrincipalGrupo]} >
                                        <Image source={grupo.icon ? { uri: `data:image/jpeg;base64,${grupo.icon}` } : require('../../../assets/images/Perfil_Grupo.png')} style={[styles.icon, expanded && styles.expandedIcon]} />
                                        <Text style={styles.text}>{grupo.name}</Text>
                                        {expanded && (
                                            <>
                                                <View>
                                                    <Text style={styles.label}>Data Revelação</Text>
                                                    <Text style={styles.text}>{format(grupo.disclosureDate, 'dd/MM/yyyy')}</Text>

                                                    <Text style={styles.label}>Valor Máx.</Text>
                                                    <Text style={styles.text}>{grupo.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>

                                                    <Text style={styles.label}>Administrador</Text>
                                                    <Text style={styles.text}>{grupo.administrator}</Text>

                                                    <Text style={styles.label}>Descrição</Text>
                                                    <Text style={styles.textDescricao}>{grupo.description}</Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <ScrollView style={styles.containerParticipantes} contentContainerStyle={{ justifyContent: 'center', paddingRight: 0, alignItems: 'center' }}>
                                    <Text style={styles.titleParticipantes}>Participantes</Text>
                                    {participante && participante.length > 0 ? (
                                        participante.map((participante) => (
                                            <TouchableOpacity key={participante.id} style={styles.containerMostraParticipante}>
                                                <Image source={participante.icon ? { uri: `data:image/jpeg;base64,${participante.icon}` } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.icon} />
                                                <Text key={participante.id}>{participante.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <Text>Nenhum participante encontrado.</Text>
                                    )}
                                </ScrollView>
                            </View>
                        )}
                        <View style={styles.container1}>
                            <TouchableOpacity style={styles.containerResultado}>
                                <View style={styles.infoResultado} >
                                    <Text style={styles.titleResultado}>Resultado</Text>
                                    <Text style={styles.text}>Sorteio não realizado!</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.containerAceitarConvite}>
                                <TouchableOpacity style={styles.btnSairDoGrupo} onPress={() => RecusarConvite(grupo.idGroup ? grupo.idGroup : 0, userData?.id || 0)}>
                                    <Text style={styles.textBtnSairDoGrupo}>Recusar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnAceitar} onPress={() => AceitarConvite(grupo.idGroup ? grupo.idGroup : 0, userData?.id || 0)}>
                                    <Text style={styles.textBtnSairDoGrupo}>Aceitar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </>
            ) : (
                <Text>Nenhum grupo encontrado.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },

    container1: {
        width: '80%',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    containerCarregamento: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    containerMostraParticipante: {
        width: '90%',
        height: 'auto',
        padding: 10,
        margin: 3,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 25,
    },

    containerAddParticipantes: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    containerParticipantes: {
        backgroundColor: '#98A62D',
        minWidth: '90%',
        maxHeight: '70%',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
    },

    containerGrupo: {
        width: '90%',
        height: 70,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#98A62D',
        borderRadius: 10,
        flexDirection: 'row',
        margin: 10,
    },

    expandedContainerGrupo: {
        width: '90%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#98A62D',
        borderRadius: 10,
        flexDirection: 'column',
        margin: 10,
        padding: 10,
    },

    containerResultado: {
        backgroundColor: '#98A62D',
        width: '90%',
        height: 70,
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'center',
    },

    titleParticipantes: {
        marginBottom: 10,
        color: '#ffffff',
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
    },

    titleResultado: {
        color: '#ffffff',
        fontFamily: 'Poppins_700Bold',
        fontSize: 15,
    },

    title: {
        fontSize: 24,
        marginBottom: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#49708a',
    },

    icon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        borderWidth: 0,
        borderColor: '#a1e000',
        borderRadius: 10,
    },

    expandedIcon: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
        borderWidth: 0,
        borderColor: '#a1e000',
        borderRadius: 10,
        marginBottom: 10,
    },

    infoPrincipalGrupo: {
        flexDirection: 'row',
        gap: 25,
        alignItems: 'center',
    },

    expandedInfoPrincipalGrupo: {
        padding: 10,
        flexDirection: 'column',
        gap: 0,
        alignItems: 'center',
    },

    infoResultado: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        color: '#ffffff',
        fontFamily: 'Poppins_400Regular',
    },

    textDescricao: {
        color: '#ffffff',
        fontFamily: 'Poppins_400Regular',
        textAlign: 'justify',
        borderRadius: 10,
        padding: 5,
        borderColor: '#f0f0f0',
        borderWidth: 1,
    },

    label: {
        marginTop: 10,
        fontFamily: 'Poppins_700Bold',
        color: '#ffffff'
    },

    btnSairDoGrupo: {
        width: '60%',
        height: 35,
        backgroundColor: '#F2441D',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnAceitar: {
        width: '60%',
        height: 35,
        backgroundColor: '#4B5918',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnEditarGrupo: {
        width: '30%',
        height: 20,
        backgroundColor: '#F29422',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnAddParticipantes: {
        width: '10%',
        height: 20,
        backgroundColor: '#F29422',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    textBtnSairDoGrupo: {
        fontFamily: 'Poppins_700Bold',
        color: '#ffffff'
    },

    textbtnEditarGrupo: {
        fontFamily: 'Poppins_700Bold',
        color: '#ffffff',
        fontSize: 10
    },

    textAddParticipantes: {
        fontFamily: 'Poppins_700Bold',
        color: '#ffffff',
        fontSize: 20
    },

    input: {
        width: '95%',
        height: 35,
        borderColor: '#49708a',
        borderWidth: 0,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        fontSize: 12
    },

    containerAceitarConvite: {
        flexDirection: 'row',
        gap: 5,
    },
});



export default DetalhesNotificacao;