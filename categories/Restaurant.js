import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { fontPercentage } from '../Main';

export default function Restaurant() {
  const data = [1, 2, 3, 4];
  return (
    <View style={styles.container}>
      <Text style={{fontSize:fontPercentage(22), margin:20}}>Restaurants</Text>
      <FlatList data={data} renderItem={({item, index}) =>
        <Pressable style={styles.list} onPress={() => alert(item)}>
          <View style={styles.component}>
            <Image style={{marginLeft: 20}}source={require('../assets/images/saved.png')} />
            <View>
              <Text>{item}</Text>
              <Text>4 min</Text>
            </View>
            <Text>{item}</Text>
          </View>
        </Pressable>
    }/>
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
  component: {
    flex:1,
    flexDirection: 'row'
  },
});

{/* <FlatList data={data} renderItem={({item, index}) => 
            <Pressable style={styles.list} onPress={() => searchResult(item)}><Text>{item.names[1]} ( {item.names[0]} )</Text></Pressable>
          }/> */}