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
import RouteSvg from './assets/images/route.svg';
import SaveSvg from './assets/images/save.svg';
import AddSvg from './assets/images/location 1 (1).svg';
import SearchIconSvg from './assets/images/search-icon.svg';
import RecentSvg from './assets/images/recent.svg';
import DeleteSvg from './assets/images/delete.svg';
import LineSvg from './assets/images/line.svg';
import BackButtonSvg from './assets/images/back-button.svg';
import SwitchSvg from './assets/images/switch.svg';
import MyLocationSvg from './assets/images/my-location.svg';
import TargetLocationSvg from './assets/images/target-location.svg';

export default function Map() {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const searchHistoryData = [{
    id: 1,
    names: ['N0', 'East Gate'],
    latitude: null,
    longitude: null,
  },
  {
    id: 2,
    names: ['N1', 'Kim Beang-Ho & Kim Sam-Youl ITC Building'],
    latitude: null,
    longitude: null,
  },
  {
    id: 3,
    names: ['N2', 'Branch Administration B/D'],
    latitude: null,
    longitude: null,
  },];
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
  const [isVisible, setVisibility] = useState(true);
  const [autoVisible, setAutoVisibility] = useState(true);
  const [isSelected, setIsSelected] = useState(true);

  const onChangeText = async (text) => {
    setSearch(text);
    setData(locationData.filter((location) => location.names.some((name) => name.includes(search))));
  }

  const searchResult = (item) => {
    setData([]);
    setModalVisible(true);
    setSearch(`${item.names[1]} (${item.names[0]})`)
  }

  const doRouting = () => {
    setVisibility(false);
  }

  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={{latitude:36.372141, longitude:127.360651, latitudeDelta:0.01, longitudeDelta:0.01}}/>
      <View style={[styles.autosearch, {display: isVisible ? 'flex' : 'none'}]}>
        <View style={styles.searchbox}>
          <SearchIconSvg width={widthPercentage(20)} height={widthPercentage(20)}/>
          <View style={{flex:1}}>
            <TextInput style = {styles.input} onChangeText={onChangeText} value={search} placeholder='Search'></TextInput>
          </View>
          <Pressable onPress={() => setSearch('')}><DeleteSvg width={widthPercentage(20)} height={widthPercentage(20)}/></Pressable>
        </View>
        <FlatList style={{display: autoVisible ? 'flex' : 'none'}} data={data} renderItem={({item, index}) => 
            <Pressable style={[styles.searcedlist, {flexDirection: 'row'}]} onPress={() => searchResult(item)}>
              <RecentSvg width={15} height={15}/>
              <View style={{marginLeft: 10, flex:1}}><Text style={{flexShrink: 1}}>{item.names[1]} ( {item.names[0]} )</Text></View>
              <DeleteSvg style={{marginLeft:10, marginRight: 10}} width={10} height={10}/>
            </Pressable>
          }/>
        <FlatList style={{display: autoVisible ? 'flex' : 'none'}} data={data} renderItem={({item, index}) => 
            <Pressable style={styles.list} onPress={() => searchResult(item)}><Text>{item.names[1]} ( {item.names[0]} )</Text></Pressable>
          }/>
      </View>
      <View style={[styles.routing, {display: !isVisible ? 'flex' : 'none'}]}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setVisibility(true)}>
            <BackButtonSvg style={{marginTop: heightPercentage(7.5)}} width={widthPercentage(29)} height={heightPercentage(24)} onPress={() => setVisibility(true)}/>
          </TouchableOpacity>
          <SwitchSvg style={{marginTop: heightPercentage(35)}} width={heightPercentage(40)} height={heightPercentage(40)}/>
        </View>
        <View>
          <View style={styles.routingsearchbox}>
            <MyLocationSvg width={25} height={25}/>
            <Text style={{marginLeft:10}}>My Location</Text>
          </View>
          <LineSvg style={{marginLeft:15}} width={10} height={20}/>
          <View style={styles.routingsearchbox}>
            <TargetLocationSvg width={25} height={25}/>
            <TextInput style = {styles.routinginput} onChangeText={onChangeText} value={search} placeholder='Search'></TextInput>
          </View>
        </View>
      </View>
      <Modal transparent={true} visible={modalVisible}>
        <View style={{position:'absolute', bottom:0, backgroundColor:'white', height:'auto', width:'100%'}}>
          <View>
            <Text>{search}</Text>
            <View style={{flexDirection:'row', justifyContent: 'center'}}>
              <TouchableOpacity style={styles.btn} onPress={() => doRouting()}>
                <RouteSvg width={20} height={20} />
                <Text style={styles.btn_txt}>Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn}>
                <SaveSvg width={20} height={20} />
                <Text style={styles.btn_txt}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => setContributionVisible(true)}>
                <AddSvg width={20} height={20} />
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
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style={isSelected ? styles.selectedStyle : styles.unselectedStyle} onPress={() => setIsSelected(true)}>
                <Text style={{color: "#FFFFFF"}}>Building</Text>
              </TouchableOpacity>
              <TouchableOpacity style={!isSelected ? styles.selectedStyle : styles.unselectedStyle} onPress={() => setIsSelected(false)}>
                <Text style={{color: "#FFFFFF"}}>Location</Text>
              </TouchableOpacity>
            </View>
            <Text>{isSelected ? "Building Name" : "Location Name"}</Text>
            <TextInput style={styles.contribute_input} />
            <Text>{isSelected ? "Floor" : "Number of Floors"}</Text>
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
    padding: widthPercentage(10),
    justifyContent : 'left',
    alignItems : 'center',
    borderRadius: 10,
  },
  routingsearchbox: {
    flexDirection: 'row',
    width: widthPercentage(290),
    height: heightPercentage(40),
    padding: widthPercentage(10),
    justifyContent : 'left',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: "#808080",
    borderWidth: 1,
  },
  input: {
    width: widthPercentage(268),
    height: heightPercentage(41),
    padding: 10
  },
  routinginput: {
    width: widthPercentage(235),
    height: heightPercentage(41),
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
  routing: {
    position: 'absolute',
    width: widthPercentage(323),
    top:50,
    flexDirection: 'row'
  },
  searcedlist: {
    marginLeft:10,
    marginBottom: 10,
    borderColor: "#000000",
    alignItems: 'center'
  },
  list: {
    marginLeft:15,
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
  selectedStyle: {
    width:widthPercentage(130),
    height: heightPercentage(36),
    backgroundColor: "#2792EA",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:5,
    margin: 10
  },
  unselectedStyle: {
    width:widthPercentage(130),
    height: heightPercentage(36),
    backgroundColor: "#94C5EE",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:5,
    margin: 10
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
