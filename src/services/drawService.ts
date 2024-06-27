import axios, { AxiosResponse } from 'axios';
import { Draw } from '../types/drawType';

const BASE_URL = 'https://localhost:7186/api/Draw/'

class DrawService {
  
  async conductDraw(groupId: number): Promise<boolean> {
    try {
      const response = await axios.post(BASE_URL + `ConductDraw`, { groupId });

      if (response.status === 200) {
        alert('Draw conducted successfully!');
        return true;
      } else {
        console.error('Error conducting draw:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error conducting draw:', error);
      return false;
    }
  }

  async getDrawResult(groupId: number, participantId: number): Promise<string | null> {
    try {
      const response: AxiosResponse<{ participantId: number, selectedName: string }> = await axios.get(BASE_URL + `GetDrawResult/${groupId}/${participantId}`);

      if (response.status === 200) {
        return response.data.selectedName;
      } else {
        console.error('Error fetching draw result:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching draw result:', error);
      return null;
    }
  }
}

export default DrawService;