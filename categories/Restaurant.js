import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Restaurant() {
  return (
    <View style={styles.container}>
      <Text>Restaurants</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
