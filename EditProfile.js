import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native'
import { fontPercentage, heightPercentage, widthPercentage } from './Main';
import { useToken } from './Token';


export default function EditProfile({navigation}) {
  const route = useRoute();
  const { email } = route.params;
  const { name } = route.params;
  const { proven } = route.params;
  const { id } = route.params;
  const [changedEmail, setChangedEmail] = useState(email);
  const [changedName, setChangedName] = useState(name);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const token = useToken();
  const [newpassword, setNewpassword] = useState('');
  const [verifyNewPassword, setVerifyNewPassword] = useState('');

  const ChangeInfo = async () => {
    const editData = {
      userEmail: changedEmail,
      userName: changedName
    };
    await fetch(`http://121.184.96.94:7070/api/v1/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    }).then(response => response.json())
    .then(data => {
      if(data.item && data.item.success) console.log(data.item.success);
      navigation.navigate('Profile');
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
  }

  const changePassword = async () => {
    if(newpassword != verifyNewPassword){
      alert('Password does not match');
      return;
    }
    const editPasswordData = {newPassword: newpassword};
    await fetch(`http://121.184.96.94:7070/api/v1/user/${id}/passwd`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${token}`,
      },
      body: JSON.stringify(editPasswordData),
    }).then(response => response.json())
    .then(data => {
      if(data.item && data.item.success) console.log(data.item.success);
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
    setPasswordModalVisible(false);
  }
  
  return (
    <View style={styles.container}>
      <Text style={{fontSize:fontPercentage(20)}}>Edit Profile</Text>
      <Image source={require('./assets/images/nupjuk.png')} style={{borderWidth:1, borderColor:'black', marginTop: heightPercentage(20)}}/>
      <View style={{marginTop: heightPercentage(30)}}>
        <Text style={styles.txt}>UserName</Text>
        <TextInput placeholder='UserName' value={changedName} onChangeText={(text) => setChangedName(text)} style={styles.input}/>
      </View>
      <View>
        <View style={{flexDirection: 'row', marginTop: heightPercentage(30), alignItems: 'center'}}>
        <Text style={styles.txt}>Email</Text>
        {proven ? <Text style={{color:'red', fontSize:fontPercentage(12), marginLeft:widthPercentage(10)}}>*Proven user cannot change their email</Text> : ''}
        </View>
        {proven ? <Text style={styles.provenemail}>{email}</Text> : <TextInput placeholder='Password' value={changedEmail} onChangeText={(text) => setChangedEmail(text)} style={styles.input}/>}
      </View>
      <TouchableOpacity style={styles.pw_edit_btn} onPress={() => setPasswordModalVisible(true)}><Text style={{color:'white'}}>Change Password</Text></TouchableOpacity>
      <TouchableOpacity style={styles.edit_btn} onPress={() => ChangeInfo()}><Text style={{color:'white'}}>Save Changes</Text></TouchableOpacity>
      <Modal visible={passwordModalVisible} transparent={false}>
        <View style={styles.change_password}>
          <Text style={{fontSize: fontPercentage(18)}}>Change Password</Text>
          <Text style={{marginTop: heightPercentage(10)}}>New Password</Text>
          <TextInput placeholder='New Password' value={newpassword} onChangeText={(text) => setNewpassword(text)} style={styles.pw_input}/>
          <Text style={{marginTop: heightPercentage(10)}}>Verify New Password</Text>
          <TextInput placeholder='Verify New Password' value={verifyNewPassword} onChangeText={(text) => setVerifyNewPassword(text)} style={styles.pw_input}/>
          <TouchableOpacity style={[styles.pw_change_btn, {alignSelf:'center'}]} onPress={() => changePassword()}><Text style={{color:'white'}}>Save Password</Text></TouchableOpacity>
        </View>
      </Modal>
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
  pw_edit_btn: {
    width: widthPercentage(195), 
    height: heightPercentage(45), 
    marginTop: heightPercentage(80), 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#EA4A27',
    borderRadius: 10
  },
  edit_btn: {
    width: widthPercentage(195), 
    height: heightPercentage(45), 
    marginTop: heightPercentage(20), 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#2792EA',
    borderRadius: 10
  },
  pw_change_btn: {
    width: widthPercentage(195), 
    height: heightPercentage(45), 
    marginTop: heightPercentage(50), 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#2792EA',
    borderRadius: 10
  },
  txt: {
    fontWeight: 'bold',
    fontSize: fontPercentage(16),
    marginLeft: widthPercentage(5)
  },
  input: {
    width: widthPercentage(342),
    height: heightPercentage(44),
    borderWidth: 1,
    borderRadius: 10,
    marginTop: heightPercentage(10),
    padding: widthPercentage(10)
  },
  provenemail: {
    width: widthPercentage(342),
    height: heightPercentage(44),
    marginTop: heightPercentage(10),
    padding: widthPercentage(10)
  },
  change_password:{
    padding: 20,
    width: widthPercentage(349),
    height: '100%',
    alignSelf:'center',
  },
  pw_input: {
    width: widthPercentage(300),
    height: heightPercentage(44),
    borderWidth: 1,
    borderRadius: 10,
    marginTop: heightPercentage(10),
    padding: widthPercentage(10)
  },
});
