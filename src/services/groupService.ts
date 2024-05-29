import axios, { AxiosResponse } from 'axios';
import { Group } from '../types/groupType';
import { User } from '../types/types';
import { UserImage } from '../types/userImage';
import { format } from 'date-fns';


const BASE_URL = 'https://localhost:7186/api/Group/'

class GroupService {

  constructor() {
    // Se necessário, adicione inicializações aqui
  }

  async createGroup(group: Group): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('name', group.name);
      formData.append('maxPeople', group.maxPeople.toString());
      formData.append('disclosureDate', group.disclosureDate.toISOString());
      formData.append('value', group.value.toString());
      formData.append('description', group.description);
      formData.append('administrator', group.administrator.toString());
      


      const responsePhoto = await fetch(group.icon);

      const blob = await responsePhoto.blob();

      formData.append('icon', blob, 'photo.*');

      const uploadResponse = await axios.post(BASE_URL + 'createGroup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (uploadResponse.status === 201) {
        alert('Grupo adicionado com sucesso!');
        return true;
      } else if (uploadResponse.status === 409) {
        console.error('Email já cadastrado');
        return false;
      } else {
        console.error('Erro ao adicionar grupo:', uploadResponse.statusText);
        return false;
      }

    } catch (error) {
      console.error('Erro ao adicionar grupo:', error);
      return false;
    }
  }

  async getGroupId(groupId: number): Promise<Group | null> {
    try {
        const response: AxiosResponse<Group> = await axios.get(BASE_URL + 'GetGroupId/'+ groupId);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar grupo pelo ID:', error);
        return null;
    }
}

async GetParticipantsByGroup(groupId: number): Promise<User | null> {
  try {
      const response: AxiosResponse<User> = await axios.get(BASE_URL + 'GetParticipantsByGroup/'+ groupId);
      return response.data;
  } catch (error) {
      console.error('Erro ao buscar participantes:', error);
      return null;
  }
}

async GetGroupsPendingByUser(userId: number): Promise<Group []| null> {
  try {
      const response: AxiosResponse<Group[]> = await axios.get(BASE_URL + 'GetGroupsPendingByUser/'+ userId);
      return response.data;
  } catch (error) {
      console.error('Erro ao buscar convites pendentes:', error);
      return null;
  }
}

async updateGroup(group: Group): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('name', group.name);
    formData.append('administrator', group.administrator.toString());
    formData.append('value', group.value.toString());
    formData.append('description', group.description);
    const da = new Date(group.disclosureDate)
    formData.append('disclosureDate', da.toDateString());
    formData.append('maxPeople', group.maxPeople.toString());
    

    // if (group.icon) {
    //   const responsePhoto = await fetch(group.icon);
    //   const blob = await responsePhoto.blob();
    //   formData.append('photo', blob, 'photo.*');
    // }

    const editResponse = await axios.put(BASE_URL + `UpdateGroup/${group.idGroup}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (editResponse.status === 200) {
      return true;
    } else {
      console.error('Erro ao editar grupo:', editResponse.statusText);
      return false;
    }
  } catch (error) {
    console.error('Erro ao editar grupo:', error);
    return false;
  }
}

async getGroupImage(groupId: number): Promise<UserImage | null> {
  try {
    const response = await axios.get<UserImage>(BASE_URL + `GetGroupImage/` + groupId);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter imagem do usuário:', error);
    return null;
  }
}
  
}

export default GroupService;