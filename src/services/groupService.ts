import axios, { AxiosResponse } from 'axios';
import { Group } from '../types/groupType';

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
  
}

export default GroupService;