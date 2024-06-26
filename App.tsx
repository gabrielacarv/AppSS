import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from './src/styles/theme';
import StackComponent from './src/routes/stack';

export default function App() {

  return (
    <StackComponent />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    fontSize:24
  },
  textInput:{
    borderColor: theme.colors.red,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 24,
    width:300,
    paddingTop: 10,
    paddingBottom: 10
  },
  button: {
    backgroundColor: theme.colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// app.tsx
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import Ola from './src/components/Ola/Ola'; // Certifique-se de que o arquivo Ola.tsx está no mesmo diretório ou ajuste o caminho

// const App: React.FC = () => {
//   return (
//     <View style={styles.container}>
//       <Ola nomeProps="SeuNomeAqui" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default App;
