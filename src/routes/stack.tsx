import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import EsqueceuSenha from '../screens/EsqueceuSenha';
import Inicial from '../screens/Inicial';
import CriarGrupo from '../screens/CriarGrupo';
import DetalhesGrupo from '../screens/DetalhesGrupo';
import Perfil from '../screens/Perfil';
import EditarGrupo from '../screens/EditarGrupo'



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type StackNavigation = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  EsqueceuSenha: undefined;
  Inicial: undefined;
  CriarGrupo: undefined;
  DetalhesGrupo: { grupoId : number | undefined};
  Perfil: undefined;
  EditarGrupo: { grupoId : number | undefined};
};

// type TabNavigation = {

// };

export type StackTypes = NativeStackNavigationProp<StackNavigation>;


const StackComponent = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#f2601d',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#98A62D',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#f2a622',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
      <Stack.Screen
        name="EsqueceuSenha"
        component={EsqueceuSenha}
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#98A62D',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
      <Stack.Screen
        name="Inicial"
        component={Inicial} // Componente do TabNavigator
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: 'white',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
      <Stack.Screen
        name="CriarGrupo"
        component={CriarGrupo}
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#f2601d',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
      <Stack.Screen
        name="DetalhesGrupo"
        component={DetalhesGrupo} 
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: 'white',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
      <Stack.Screen
        name="Perfil"
        component={Perfil} 
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#f2601d',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
      <Stack.Screen
        name="EditarGrupo"
        component={EditarGrupo} 
        options={({ route, navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#f2601d',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

// const TabNavigator = () => (
//   <Tab.Navigator>
//     <Tab.Screen name="Inicial" component={Inicial} />
//     <Tab.Screen name="CriarGrupo" component={CriarGrupo} />
//   </Tab.Navigator>
// );

export default StackComponent;
