import axios, { AxiosResponse } from 'axios';
import { User } from '../types/types';
import { UserImage } from '../types/userImage';
import {ResetPassword} from '../types/resetPassword'

const BASE_URL = 'https://localhost:7186/api/User/'

class UserService {

  constructor() {
  }


  async getUserById(userId: number): Promise<User | null> {
    try {
      const response: AxiosResponse<User> = await axios.get(`${BASE_URL}UserById/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário pelo ID:', error);
      return null;
    }
  }

  async addUser(user: User): Promise<boolean> {
    try {

      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('password', user.password);

      const responsePhoto = await fetch(user.photo);

      const blob = await responsePhoto.blob();

      formData.append('photo', blob, 'photo.*');

      const uploadResponse = await axios.post(BASE_URL + 'addUser', formData, {
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
        console.error('Erro ao adicionar usuário:', uploadResponse.statusText);
        return false;
      }

    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      return false;
    }
  }

  async updateUser(user: User): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('password', user.password);

      if (user.photo) {
        const responsePhoto = await fetch(user.photo);
        const blob = await responsePhoto.blob();
        formData.append('photo', blob, 'photo.*');
      }

      const editResponse = await axios.put(BASE_URL + `UpdateUser/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (editResponse.status === 200) {
        return true;
      } else {
        console.error('Erro ao editar usuário:', editResponse.statusText);
        return false;
      }
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      return false;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const response: AxiosResponse<{ token: string }> = await axios.post(`${BASE_URL}Login`, {
        email: email,
        password: password
      });

      if (response.status === 200 && response.data.token) {
        const userResponse: AxiosResponse<User> = await axios.get(`${BASE_URL}UserByEmail/${email}`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`
          }
        });

        return userResponse.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      return null; 
    }
  }

  async getUserImage(userId: number): Promise<UserImage | null> {
    try {
      const response = await axios.get<UserImage>(BASE_URL + `GetUserImage/` + userId);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter imagem do usuário:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}UserByEmail/${email}`);

      if (response.status !== 200) {
        throw new Error('Erro ao obter usuário');
      }

      const user = response.data;
      return user;
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const response = await axios.post(`${BASE_URL}RequestPasswordReset/${email}`);
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return false;
    }
  }

  async resetPassword(reset: ResetPassword): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('token', reset.token);
      formData.append('password', reset.password);

      const uploadResponse = await axios.post(BASE_URL + 'ResetPassword', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return uploadResponse.status === 200;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return false;
    }
  }
}

export default UserService;