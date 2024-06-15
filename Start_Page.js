import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ImageBackground, Button, Text, TextInput, TouchableOpacity } from 'react-native';
import { fontPercentage, heightPercentage, widthPercentage } from './Main';
import UserSvg from './assets/images/User.svg';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('screen');

const App = ({navigation}) => {
  const [id, setId] = useState('');

{/*useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("Tokens");
        if (value != null) {
          navigation.navigate('Drawer')
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, []);*/}
  
  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/images/Background.png')} style={styles.backgroundImage} resizeMode="contain">
        <TextInput style = {styles.input} placeholder='Id' value={id} onChangeText={(text) => setId(text)}></TextInput>
        <TouchableOpacity style={styles.login_btn} onPress={() => navigation.navigate('Login')}>
            <UserSvg width={heightPercentage(35)} height={heightPercentage(35)}/>
            <Text style={{color:'white', marginLeft: 10}}>Log-in with KAIST Auth</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={{width:widthPercentage(91), height:0, borderWidth:0.5, borderColor:'#666'}}></View>
            <Text style={{margin:10, color:"#666"}}>or</Text>
            <View style={{width:widthPercentage(91), height:0, borderWidth:0.5, borderColor:'#666'}}></View>
        </View>
        <Text style={{color:"#BFBFBF"}}>Continue as Guest</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login_btn: {
    flexDirection: 'row',
    width: widthPercentage(279),
    height: heightPercentage(54),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#337CD7",
    borderRadius:10
  },
  input: {
    borderWidth:1,
    width: widthPercentage(342),
  }
});

export default App;
