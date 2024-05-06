import axios, { AxiosResponse } from 'axios';
import { Invitation } from "../types/invitationType";


const BASE_URL = 'https://localhost:7186/api/Invitation/'

class InvitationService {

    constructor() {
      // Se necessário, adicione inicializações aqui
    }
  
    async createInvitation(invitation: Invitation): Promise<boolean> {
      try {
        const formData = new FormData();
        formData.append('groupId', invitation.groupId.toString());
        formData.append('recipientId', invitation.recipientId.toString());
        formData.append('senderId', invitation.senderId.toString());
        formData.append('status', invitation.status);
    
        const uploadResponse = await axios.post(BASE_URL + 'createInvitation', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        // Verifica o código de status da resposta
        if (uploadResponse.status === 201) {
          alert('Convite criado com sucesso!');
          return true;
        } else if (uploadResponse.status === 409) {
          console.error('Já existe um convite para este grupo e destinatário');
          return false;
        } else {
          console.error('Erro ao criar convite:', uploadResponse.statusText);
          return false;
        }
    
      } catch (error) {
        console.error('Erro ao criar convite:', error);
        return false;
      }
    }
    
    
  }
  
  export default InvitationService;