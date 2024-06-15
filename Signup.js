import React, { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { widthPercentage, heightPercentage } from './Main';

const { width, height } = Dimensions.get('screen');

export default function Profile({navigation}) {
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [name, setName] = useState('');

    const id_duplication_check = async (id) => {
      if (!id) {
        alert("Enter your Id!");
        return false;
      }
    
      try {
        const response = await fetch(`http://121.184.96.94:7070/api/v1/auth/sign-up/user/duplication/id?payload=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
        if (data.item && data.item.isDuplicated) {
          console.log(data.item.isDuplicated);
          if (data.item.isDuplicated) {
            alert("Duplicate ID Exists");
          }
          return false;
        } else {
          return true;
        }
      } catch (error) {
        console.error('Error: ', error);
        return false;
      }
    }
    

    const email_validation_check = async (email) => {
      if(!email){
        alert("Enter your Email!");
        return false;
      }
      if(!email.endsWith('@kaist.ac.kr')) {
        alert("Email should end with '@kaist.ac.kr'");
        return false;
      }
      try {
        const response = await fetch(`http://121.184.96.94:7070/api/v1/auth/sign-up/user/duplication/email?payload=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
        if (data.item && data.item.isDuplicated) {
          console.log(data.item.isDuplicated);
          if (data.item.isDuplicated) {
            alert("Duplicate Email Exists");
          }
          return false;
        } else {
          return true;
        }
      } catch (error) {
        console.error('Error: ', error);
        return false;
      }
    }

    const submit = async (id, email, pw, name) => {
      if(!name){
        alert("Enter your Name!");
        return;
      }

      const isIdValid = await id_duplication_check(id);
      const isEmailValid = await email_validation_check(email);

      if(!isIdValid || !isEmailValid) {
        console.log('ID or Email is not valid');
        console.log('ID Valid:', isIdValid);
        console.log('Email Valid:', isEmailValid);
        return;
      }

      if(!pw){
        alert("Enter your Password!");
        return;
      }

      const userData = {
          userId: id,
          userEmail: email,
          password: pw,
          userName: name
      };

      try {
        const response = await fetch('http://121.184.96.94:7070/api/v1/auth/sign-up/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        if(data.item && data.item.success) {
          console.log(data.item.success);
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/images/Background.png')} style={styles.backgroundImage} resizeMode="contain">
      <TextInput style={styles.input} placeholder='UserName' placeholderTextColor='#979797' value={name} onChangeText={text => setName(text)} />
      <TextInput style={styles.input} placeholder='UserId' placeholderTextColor='#979797' value={id} onChangeText={text => setId(text)} />
      <TextInput style={styles.input} placeholder='Email' placeholderTextColor='#979797' value={email} onChangeText={text => setEmail(text)} />
      <TextInput style={styles.input} placeholder='Password' placeholderTextColor='#979797' value={pw} onChangeText={text => setPw(text)} secureTextEntry />
      <TouchableOpacity style={styles.signup_btn} onPress={() => submit(id, email, pw, name)}>
        <Text style={{color: 'white'}}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.login_btn}>
        <Text style={{color:'#B0B0B0'}}>You already have an account?</Text>
        <TouchableOpacity style={{marginLeft: widthPercentage(5)}} onPress={() => navigation.navigate('Login')}>
          <Text style={{color:'#2792EA', textDecorationLine:'underline'}}>Login</Text>
        </TouchableOpacity>
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
    borderWidth: 1,
    width: widthPercentage(342),
    height: heightPercentage(44),
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: heightPercentage(22),
    borderColor: 'rgba(84, 76, 76, 0.14)',
  },
  signup_btn: {
    flexDirection: 'row',
    width: widthPercentage(227),
    height: heightPercentage(41),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#337CD7",
    borderRadius: 10,
    marginTop: heightPercentage(30),
  },
  login_btn: {
    flexDirection: 'row',
    marginTop: heightPercentage(5),
    marginBottom: heightPercentage(300),
  },
});
