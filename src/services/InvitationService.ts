import axios, { AxiosResponse } from 'axios';
import { Invitation } from "../types/invitationType";


const BASE_URL = 'https://localhost:7186/api/Invitation/'

class InvitationService {

  constructor() {
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

  async updateStatus(groupId: number, newStatus: string, recipientId: number): Promise<boolean> {
    try {
        const formData = new FormData();
        formData.append('status', newStatus);
        formData.append('recipientId', recipientId.toString());

        const updateResponse = await axios.put(BASE_URL + `UpdateInvitationStatus/${groupId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (updateResponse.status === 200) {
            console.log('Status atualizado com sucesso!');
            return true;
        } else {
            console.error('Erro ao atualizar status:', updateResponse.statusText);
            return false;
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        return false;
    }
}

}

export default InvitationService;