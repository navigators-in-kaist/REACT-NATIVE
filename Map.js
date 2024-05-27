import React, {useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View 
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { widthPercentage, heightPercentage, fontPercentage } from './Main';
import {locationData} from './Buildings.js';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Map() {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [contributionVisible, setContributionVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Restaurants', value: 'Restaurants'},
    {label: 'Convenienve Stores', value: 'Convenienve Stores'},
    {label: 'Cafes', value: 'Cafes'},
    {label: 'Gyms', value: 'Gyms'},
    {label: 'Dormitories', value: 'Dormitories'},
    {label: 'Coworking Spaces', value: 'Coworking Spaces'}
  ]);

  const onChangeText = async (text) => {
    setSearch(text);
    setData(locationData.filter((location) => location.names.some((name) => name.includes(search))));
  }

  const searchResult = (item) => {
    setData([item]);
    setModalVisible(true);
    setSearch(`${item.names[1]} (${item.names[0]})`)
  }

  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={{latitude:36.372141, longitude:127.360651, latitudeDelta:0.01, longitudeDelta:0.01}}/>
      <View style={styles.autosearch}>
        <View style={styles.searchbox}>
          <Image style = {styles.logo} source={require('./assets/images/search-icon.png')}></Image>
          <TextInput style = {styles.input} onChangeText={onChangeText} value={search} placeholder='Search'></TextInput>
        </View>
        <FlatList data={data} renderItem={({item, index}) => 
            <Pressable style={styles.list} onPress={() => searchResult(item)}><Text>{item.names[1]} ( {item.names[0]} )</Text></Pressable>
          }/>
      </View>
      <Modal transparent={true} visible={modalVisible}>
        <View style={{position:'absolute', bottom:0, backgroundColor:'white', height:'auto', width:'100%'}}>
          <View>
            <Text>{search}</Text>
            <View style={{flexDirection:'row', justifyContent: 'center'}}>
              <TouchableOpacity style={styles.btn}>
                <Image source={require('./assets/images/route.png')}/>
                <Text style={styles.btn_txt}>Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn}>
                <Image source={require('./assets/images/save.png')}/>
                <Text style={styles.btn_txt}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => setContributionVisible(true)}>
                <Image source={require('./assets/images/add.png')}/>
                <Text style={styles.btn_txt}>Add</Text>
              </TouchableOpacity>
            </View>
            <Button title='close' onPress={() => setModalVisible(false)}/>
          </View>
        </View>
      </Modal>
      <Modal visible={contributionVisible} transparent={true}>
        <View style={styles.contribution}>
          <View>
            <Text style={{fontWeight: 'bold', fontSize:fontPercentage(18)}}>Contribute</Text>
            <Text>Location Name</Text>
            <TextInput style={styles.contribute_input} />
            <Text>Floor</Text>
            <DropDownPicker open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} />
            <Text>Category</Text>
            <DropDownPicker open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} />
            <Text>Description</Text>
            <TextInput style={styles.contribute_input} />
          </View>
          <Button title='close' onPress={() => setContributionVisible(false)}/>
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
  map: {
    width:'100%',
    height:'100%'
  },
  searchbox: {
    flexDirection: 'row',
    width: widthPercentage(323),
    height: heightPercentage(40),
    padding: 10,
    justifyContent : 'left',
    alignItems : 'center',
    borderRadius: 10,
  },
  logo: {
    width: 20,
    height: 20
  },
  input: {
    width: '100%',
    height: 41,
    padding: 10
  },
  autosearch: {
    position: 'absolute',
    width: widthPercentage(323),
    top:50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: "#808080",
    borderWidth: 1,
    borderRadius: 10,
  },
  list: {
    marginLeft:10,
    marginBottom: 10,
    borderColor: "#000000",
  },
  btn: {
    width:widthPercentage(78),
    height: heightPercentage(35),
    backgroundColor: "#2792EA",
    alignItems: 'center',
    justifyContent: 'center',
    margin:10,
    flexDirection: 'row',
    borderRadius:5
  },
  btn_txt: {
    color: "#FFFFFF",
    marginLeft:5,
    fontWeight:'400'
  },
  contribution:{
    padding: 20,
    margin: 70,
    backgroundColor: 'white',
    width: widthPercentage(349),
    height: heightPercentage(600),
    borderRadius: 10,
    alignSelf:'center',
    shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
  },
  contribute_input: {
    borderWidth:1,
    borderRadius:5,
    height: heightPercentage(50)
  }
});
