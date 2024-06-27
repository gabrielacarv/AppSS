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
import DrawService from '../../services/drawService';
import { ActivityIndicator } from 'react-native';


const DetalhesGrupo = ({ route }: any) => {
    const navigation = useNavigation<StackTypes>();
    const [userData, setUserData] = useState<User | null>(null);
    const [grupo, setGrupo] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [participante, setparticipante] = useState<User | null>(null);
    const [newParticipantEmail, setNewParticipantEmail] = useState('');
    const [grupoId, setgrupoId] = useState(route.params.grupoId);
    const [remetenteId, setRemetenteId] = useState(0);
    const [drawResult, setDrawResult] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);


    const groupService = new GroupService();
    const invitationService = new InvitationService();
    const userService = new UserService();
    const drawService = new DrawService();

    const isFocused = useIsFocused();
    const [expanded, setExpanded] = useState(false);


    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const fetchGrupo = async () => {
            try {
                const fetchedGrupo = await groupService.getGroupId(route.params.grupoId);
                if (fetchedGrupo) {
                    setGrupo(fetchedGrupo);
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

        const fetchParticipantes = async () => {
            try {
                const fetchedParticipantes = await groupService.GetParticipantsByGroup(route.params.grupoId);
                if (fetchedParticipantes) {
                    setparticipante(fetchedParticipantes);
                } else {
                    setError('Participantes não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar participantes:', error);
                setError('Erro ao buscar usuparticipantesário. Tente novamente mais tarde.');
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
                }
            } catch (error) {
                console.error('Erro ao recuperar dados do usuário:', error);
            }
        };

        const fetchDrawResult = async () => {
            if (userData && grupo) {
                try {
                    const result = await drawService.getDrawResult(grupo.idGroup? grupo.idGroup : 0, userData.id? userData.id : 0);
                    setDrawResult(result);
                } catch (error) {
                    console.error('Erro ao buscar resultado do sorteio:', error);
                }
            }
        };

        const fetchUser = async () => {
            const userService = new UserService();
            const userData = await userService.getUserById(grupo?.administrator ? grupo?.administrator : 0);
            setUser(userData);
          };

        fetchGrupo();
        fetchUserData();
        fetchParticipantes();
        fetchDrawResult();
        fetchUser();
    // }, [route.params.grupoId, isFocused, navigation, userData, grupo]);
    }, [route.params.grupoId, isFocused, navigation]);

    const VerificaAdministrador = () => {
        if (userData?.id === grupo?.administrator) {
            return (
                <TouchableOpacity style={styles.btnEditarGrupo} onPress={() => { navigation.navigate("EditarGrupo", { grupoId: grupo?.idGroup }); }}>
                    <Text style={styles.textbtnEditarGrupo}>Editar</Text>
                </TouchableOpacity>
            );
        } else {
            return null; // Retorna null se a condição não for verdadeira
        }
    };

    const VerificaAdministrador2 = () => {
        if (userData?.id === grupo?.administrator) {
            return (
                <View style={styles.containerAddParticipantes}>
                    <TextInput
                        style={styles.input}
                        placeholder='Email do Participante'
                        onChangeText={text => setNewParticipantEmail(text)}
                        value={newParticipantEmail}
                    />
                    <TouchableOpacity style={styles.btnAddParticipantes} onPress={handleAddParticipant}>
                        <Text style={styles.textAddParticipantes}>+</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return null; // Retorna null se a condição não for verdadeira
        }
    };

    const VerificaAdministrador3 = () => {
        if (userData?.id === grupo?.administrator && !drawResult) {
            return (
                <View style={styles.container1}>
                    <TouchableOpacity style={styles.btnSortear} onPress={handleConductDraw}>
                        <Text style={styles.textBtnSortear}>Sortear</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return null;
        }
    };


    // const handleAddParticipant = async () => {
    //     // Verifique se o email do participante não está vazio
    //     if (!newParticipantEmail.trim()) {
    //         alert('Por favor, insira um email válido.');
    //         return;
    //     }

    //     try {
    //         // Verifique se o participante já está no grupo
    //         // if (participante && participante.some(p => p.email === newParticipantEmail)) {
    //         //     alert('Este participante já está no grupo.');
    //         //     return;
    //         // }

    //         // // Verifique se o participante existe no banco de dados
    //         // const participantExists = await groupService.checkParticipantExists(newParticipantEmail);

    //         // if (!participantExists) {
    //         //     alert('Este participante não existe.');
    //         //     return;
    //         // }

    //         const rem : User =  userService.getUserByEmail(newParticipantEmail)
    //         const id = rem.id ? rem.id : 0
    //         setRemetenteId(id);

    //         setgrupoId(grupo?.idGroup ? grupo?.idGroup : 0)

    //         const invitation: Invitation = {
    //             groupId: grupoId,
    //             recipientId: remetenteId,
    //             senderId: userData?.id ? userData.id : 0,
    //             status: 'Aceito',
    //           };

    //         // // Adicione o participante ao grupo
    //         invitationService.createInvitation(invitation);

    //         // Atualize a lista de participantes
    //         const updatedParticipants = await groupService.GetParticipantsByGroup(route.params.grupoId);
    //         setparticipante(updatedParticipants);

    //         // Limpe o campo de email do participante
    //         setNewParticipantEmail('');
    //     } catch (error) {
    //         console.error('Erro ao adicionar participante:', error);
    //         alert('Erro ao adicionar participante. Tente novamente mais tarde.');
    //     }
    // };

    const handleAddParticipant = async () => {
        // Verifique se o email do participante não está vazio
        if (!newParticipantEmail.trim()) {
            alert('Por favor, insira um email válido.');
            return;
        }

        try {
            // Obtenha o usuário pelo email
            const rem: User = await userService.getUserByEmail(newParticipantEmail);

            // Verifique se o usuário foi encontrado
            if (!rem) {
                alert('Usuário não encontrado.');
                return;
            }

            // Extraia o ID do usuário
            const RecipientId = rem.id ? rem.id : 0;

            // Defina o ID do remetente e o ID do grupo
            
            setgrupoId(grupo?.idGroup ? grupo?.idGroup : 0);

            // Crie um objeto de convite
            const invitation: Invitation = {
                groupId: grupoId,
                recipientId: RecipientId,
                senderId: userData?.id ? userData.id : 0,
                status: 'Pendente',
            };

            // Envie o convite para o serviço
            invitationService.createInvitation(invitation);

            // Atualize a lista de participantes
            const updatedParticipants = await groupService.GetParticipantsByGroup(route.params.grupoId);
            setparticipante(updatedParticipants);

            // Limpe o campo de email do participante
            setNewParticipantEmail('');
        } catch (error) {
            console.error('Erro ao adicionar participante:', error);
            alert('Erro ao adicionar participante. Tente novamente mais tarde.');
        }
    };

    const handleConductDraw = async () => {
        try {
            const success = await drawService.conductDraw(grupoId);
            if (success) {
                alert('Sorteio realizado com sucesso!');
                const result = await drawService.getDrawResult(grupoId, userData?.id ? userData.id : 0);
                setDrawResult(result);
            } else {
                alert('Erro ao realizar sorteio.');
            }
        } catch (error) {
            console.error('Erro ao realizar sorteio:', error);
            alert('Erro ao realizar sorteio. Tente novamente mais tarde.');
        }
    };

    const handleLeaveGroup = async () => {
        try {
          if (!userData || !userData.id) {
            throw new Error('ID do usuário não encontrado.');
          }
    
          const success = await groupService.leaveGroup(grupoId, userData.id);
          if (success) {
            alert('Você saiu do grupo com sucesso.');
            navigation.navigate('Inicial');
          } else {
            alert('Erro ao sair do grupo.');
          }
        } catch (error) {
          console.error('Erro ao sair do grupo:', error);
          alert('Erro ao sair do grupo. Tente novamente mais tarde.');
        }
      };

    return (
        <View style={styles.container}>
            {loading ? (
                // <Text>Carregando...</Text>
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
                                        {/* <Text style={styles.text}>{`0/${grupo.maxPeople}`}</Text> */}
                                        <VerificaAdministrador />
                                        {expanded && (
                                            <>
                                                <View>
                                                    <Text style={styles.label}>Data Revelação</Text>
                                                    <Text style={styles.text}>{format(grupo.disclosureDate, 'dd/MM/yyyy')}</Text>

                                                    <Text style={styles.label}>Valor Máx.</Text>
                                                    <Text style={styles.text}>{grupo.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>

                                                    <Text style={styles.label}>Administrador</Text>
                                                    <Text style={styles.text}>{user?.name}</Text>

                                                    <Text style={styles.label}>Descrição</Text>
                                                    <Text style={styles.textDescricao}>{grupo.description}</Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <ScrollView style={styles.containerParticipantes} contentContainerStyle={{ justifyContent: 'center', paddingRight: 0, alignItems: 'center' }}>
                                    <Text style={styles.titleParticipantes}>Participantes</Text>

                                    <VerificaAdministrador2 />

                                    {participante.map(participante => (
                                        <TouchableOpacity key={participante.id} style={styles.containerMostraParticipante}>
                                            <Image source={participante.icon ? { uri: `data:image/jpeg;base64,${participante.icon}` } : require('../../../assets/images/Perfil_Grupo.png')} style={styles.icon} />
                                            <Text key={participante.id}>{participante.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <View style={styles.container1}>
                            <TouchableOpacity style={styles.containerResultado}>
                                <View style={styles.infoResultado} >
                                    <Text style={styles.titleResultado}>Resultado</Text>
                                    <Text style={styles.text}>{drawResult ? `Você tirou: ${drawResult}` : 'Sorteio não realizado!'}</Text>
                                </View>
                            </TouchableOpacity>

                            <VerificaAdministrador3 />

                            <TouchableOpacity style={styles.btnSairDoGrupo} onPress={handleLeaveGroup}>
                                <Text style={styles.textBtnSairDoGrupo}>Sair do Grupo</Text>
                            </TouchableOpacity>
                        </View>
                            </View>

                            
                        )}
                        
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

    containerCarregamento:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    container1: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
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
        maxHeight: '80%',
        // alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
    },

    containerGrupo: {
        width: '90%',
        height: 70,
        // paddingRight: 30,
        // paddingLeft: 30,
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
        marginBottom: 20,
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
        // padding: 10,
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
        // backgroundColor: '#f0f0f0',
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
        width: '40%',
        height: 35,
        backgroundColor: '#F2441D',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },

    btnSortear: {
        width: '40%',
        height: 35,
        backgroundColor: '#F29422',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },

    btnEditarGrupo: {
        width: '30%',
        height: 20,
        // backgroundColor: '#F2441D',
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

    textBtnSortear: {
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

});



export default DetalhesGrupo;