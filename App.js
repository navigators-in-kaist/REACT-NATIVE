import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [text, setText] = useState('');

  const onChangeText = (inputText) => {
    setText(inputText);
  };

  return (
    <View style={styles.container}>
      <Text>Signup</Text>
      <TextInput style = {styles.input} onChangeText = {onChangeText} value = {text} placeholder = "Name"></TextInput>
      <TextInput style = {styles.input} onChangeText = {onChangeText} value = {text} placeholder = "Name"></TextInput>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: "#000000",
    borderWidth: 1,
    width: 200,
    height: 40,
    marginTop: 20,
  },
  burtton: {
    backgroundColor: "EEEEEE",
  },
});
