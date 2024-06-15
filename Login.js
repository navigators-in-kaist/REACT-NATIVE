import React, { useState, useEffect } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentage, heightPercentage } from './Main';
import { useSetToken } from './Token';


const { width, height } = Dimensions.get('screen');

export default function Profile({navigation}) {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const setToken = useSetToken();

    useEffect(() => {
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
    }, []);

    const submit = async (id, pw) => {
        const userData = {
            userId: id,
            password: pw,
        };
        await fetch('http://121.184.96.94:7070/api/v1/auth/login/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then((data) => {
          if(data.item){
            const accesstoken = data.item.access_token;
            const refreshtoken = data.item.refresh_oken;
            try {
              AsyncStorage.setItem('Tokens', JSON.stringify({
                'accessToken': accesstoken,
                'refreshToken': refreshtoken
              }))
              setToken(accesstoken);
              AsyncStorage.setItem('UserId', id);
              navigation.navigate('Drawer');
            } catch (error) {
              console.error('Error storing tokens: ', error);
              alert("Failed to store tokens");
            }
          }
          else alert("Wrong Login Information!!");
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
    };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/images/Background.png')} style={styles.backgroundImage} resizeMode="contain">
      <TextInput style = {styles.input} placeholder='Id' placeholderTextColor='#979797' value={id} onChangeText={(text) => setId(text)}></TextInput>
      <TextInput style = {styles.input} placeholder='Password' placeholderTextColor='#979797' value={pw} onChangeText={text => setPw(text)}></TextInput>
      <TouchableOpacity style={styles.login_btn}onPress={() => submit(id, pw)}><Text style={{color:'white'}}>Login</Text></TouchableOpacity>
      <View style={styles.signup_btn}>
        <Text style={{color:'#B0B0B0'}}>You do not have an account?</Text>
        <TouchableOpacity style={{marginLeft:widthPercentage(5)}} onPress={() => navigation.navigate('Signup')}><Text style={{color:'#2792EA', textDecorationLine:'underline'}}>Sign Up</Text></TouchableOpacity>
      </View>
      </ImageBackground>
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
  backgroundImage: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth:1,
    width: widthPercentage(342),
    height: heightPercentage(44),
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: heightPercentage(22),
    borderColor: 'rgba(84, 76, 76, 0.14)'
  },
  login_btn: {
    flexDirection: 'row',
    width: widthPercentage(227),
    height: heightPercentage(41),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#337CD7",
    borderRadius:10,
    marginTop: heightPercentage(22)
  },
  signup_btn: {
    flexDirection: 'row',
    marginTop: heightPercentage(5),
    marginBottom: heightPercentage(150)
  }
});
