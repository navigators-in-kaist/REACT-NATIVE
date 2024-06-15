import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontPercentage, heightPercentage, widthPercentage } from './Main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToken } from './Token'
import { TextInput } from 'react-native-gesture-handler';

export default function Profile({navigation}) {
  const token = useToken();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [proven, setProven] = useState(false);
  const [email, setEmail] = useState('');
  const [bool, setBool] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [trialId, setTrialId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userid = await AsyncStorage.getItem('UserId');
        if (userid !== null) {
          setId(userid);
        }
      } catch (error) {
        console.error('Failed to fetch the userid from storage', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      await fetch(`http://121.184.96.94:7070/api/v1/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'KAuthorization': `Bearer ${token}`,
        },
      }).then(response=>response.json())
      .then(data => {
        setName(data.item.userName);
        if(data.item.isProvenUser == true) setProven(true);
        setEmail(data.item.userEmail);
      })
      .catch((error) => {
          console.error('Error: ', error);
      })
    }

    getUserInfo();

    const unsubscribe = navigation.addListener('focus', () => {
      getUserInfo();
    });
    return unsubscribe;
  }, [id, token]);

  const verifyEmail = () => {
    if(!bool){
      const data = {userId: id};
      fetch('http://121.184.96.94:7070/api/v1/auth/prove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'KAuthorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(response=>response.json())
      .then(data => {
        console.log(data);
        if(data.item && data.item.generatedProveTrialId) setTrialId(data.item.generatedProveTrialId);
      })
      .catch((error) => {
          console.error('Error: ', error);
      })
      setBool(true);
    }
    else{
      const data = {verifyCode: verificationCode};
      fetch(`http://121.184.96.94:7070/api/v1/auth/prove/${trialId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'KAuthorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(response=>response.json())
      .then(data => {
        if(data.item && data.item.success) console.log(data.item.success);
      })
      .catch((error) => {
          console.error('Error: ', error);
      })
      setBool(false);
      setVerificationCode('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize:fontPercentage(20)}}>User Profile</Text>
      <Image source={require('./assets/images/nupjuk.png')} style={{borderWidth:1, borderColor:'black', marginTop: heightPercentage(20)}}/>
      <View style={{marginTop: heightPercentage(10), flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontSize:fontPercentage(25)}}>{name}</Text>
        <Image source={require('./assets/images/badge.png')} style={{marginLeft: 5, display: proven ? 'flex' : 'none'}}/>
      </View>
      <View style={{flexDirection: 'row', marginTop: heightPercentage(50), alignItems:'center'}}>
        <Text style={{fontSize: fontPercentage(10)}}>Email</Text>
        <Text style={{marginLeft: widthPercentage(10), fontSize: fontPercentage(14)}}>{email}</Text>
      </View>
      <TouchableOpacity style={styles.edit_btn} onPress={() => navigation.navigate('EditProfile', {email: email, name: name, proven: proven, id: id})}><Text style={{color:'white'}}>Edit Credentials</Text></TouchableOpacity>
      { !proven && <View>{bool ? <TextInput placeholder='verification code' style={styles.input} value={verificationCode} onChangeText={(text) => setVerificationCode(text)}/> : null}
      <TouchableOpacity style={styles.verify_btn} onPress={() => verifyEmail()}><Text style={{color:'white'}}>{bool ? 'Confirm' : 'Verify Email'}</Text></TouchableOpacity></View>}
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
  edit_btn: {
    width: widthPercentage(195), 
    height: heightPercentage(45), 
    marginTop: heightPercentage(100), 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#2792EA',
    borderRadius: 10
  },
  verify_btn: {
    width: widthPercentage(195), 
    height: heightPercentage(45), 
    marginTop: heightPercentage(20), 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#2792EA',
    borderRadius: 10
  },
  input: {
    width: widthPercentage(195),
    height: heightPercentage(45),
    borderWidth: 1,
    marginTop: heightPercentage(20),
    borderRadius: 10,
    padding: 10
  }
});
