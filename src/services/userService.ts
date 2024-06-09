import axios, { AxiosResponse } from 'axios';
import { User } from '../types/types';
import { UserImage } from '../types/userImage';
import {ResetPassword} from '../types/resetPassword'

const BASE_URL = 'https://localhost:7186/api/User/'

class UserService {

  constructor() {
    // Se necessário, adicione inicializações aqui
  }

  // async addUser(user: User): Promise<boolean> {
  //   try {
  //     const response = await axios.post(`${BASE_URL}`, user);
  //     return response.status === 201; // Retorna true se o usuário foi adicionado com sucesso
  //   } catch (error) {
  //     console.error('Erro ao adicionar usuário:', error);
  //     return false; // Retorna false em caso de erro
  //   }
  // }

  async addUser(user: User): Promise<boolean> {
    try {
      //  const response = await axios.post(`${BASE_URL}`, user);

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


  // async validateUser(username: string, password: string): Promise<boolean> {
  //   try {
  //     const response: AxiosResponse<User[]> = await axios.get(`${BASE_URL}?username=${username}&password=${password}`);
  //     //na aplicação de vocês não retorna array não e o metodo sera um post que retorna um unico usuario.
  //     if (response.data.length === 0) {
  //       return false;
  //     }

  //     return response.status === 200;
  //   } catch (error) {
  //     console.error('Erro ao validar usuário:', error);
  //     return false; // Retorna false em caso de erro
  //   }
  // }

  //   async validateUser(email: string, password: string): Promise<boolean> {
  //     try {
  //         const response: AxiosResponse<{ token: string }> = await axios.post(`${BASE_URL}Login`, {
  //             email: email,
  //             password: password
  //         });

  //         if (response.status === 200 && response.data.token) {
  //             return true;
  //         } else {
  //             return false;
  //         }
  //     } catch (error) {
  //         console.error('Erro ao validar usuário:', error);
  //         return false; // Retorna false em caso de erro
  //     }
  // }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const response: AxiosResponse<{ token: string }> = await axios.post(`${BASE_URL}Login`, {
        email: email,
        password: password
      });

      if (response.status === 200 && response.data.token) {
        // Se a autenticação for bem-sucedida, faça outra solicitação para obter os dados do usuário
        const userResponse: AxiosResponse<User> = await axios.get(`${BASE_URL}UserByEmail/${email}`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`
          }
        });

        return userResponse.data; // Retorna os dados do usuário
      } else {
        return null; // Retorna null se a autenticação falhar
      }
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      return null; // Retorna null em caso de erro
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

      // Axios não possui uma propriedade 'ok', verifique o status diretamente
      if (response.status !== 200) {
        // Se a resposta não estiver ok, lança um erro
        throw new Error('Erro ao obter usuário');
      }

      // O resultado está disponível diretamente na propriedade 'data'
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
      formData.append('password', reset.password); // Certifique-se de usar o nome correto conforme esperado pelo backend

      const uploadResponse = await axios.post(BASE_URL + 'ResetPassword', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return uploadResponse.status === 200; // Verifique a variável correta
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return false;
    }
  }
}

export default UserService;