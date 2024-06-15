import React, { useState, useEffect } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { fontPercentage, heightPercentage, widthPercentage } from './Main';
import { useToken } from './Token';

export default function MyContribution({navigation}) {
  const accessToken = useToken();
  const [contributionData, setContributionData] = useState([]);
  const [contributionId, setContributionId] = useState('');
  const [locationContributionVisible, setLocationContributionVisible] = useState(false);
  const [buildingContributionVisible, setBuildingContributionVisible] = useState(false);
  const [name, setName] = useState('');
  const [officialCode, setOfficialCode] = useState('');
  const [buildingAlias, setBuildingAlias] = useState('');
  const [maxFloor, setMaxFloor] = useState('');
  const [description, setDescription] = useState('');
  const [floor, setFloor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
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
  const [state, setState] = useState('');
    
  useEffect(() => {
    (async () => {
        await fetch('http://121.184.96.94:7070/api/v1/contribution', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'KAuthorization': `Bearer ${accessToken}`,
          },
        }).then(response=>response.json())
        .then(data => {
          if(data.item && data.item.contributionList) setContributionData(data.item.contributionList);
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
    })();
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        await fetch('http://121.184.96.94:7070/api/v1/contribution', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'KAuthorization': `Bearer ${accessToken}`,
          },
        }).then(response=>response.json())
        .then(data => {
          if(data.item && data.item.contributionList) setContributionData(data.item.contributionList);
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
    })();
    });
    return unsubscribe;
  }, [state]);

  const setCategory = async () => {
    await fetch(`http://121.184.96.94:7070/api/v1/location-category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
    .then(data => {
      if(data.item.locationCategoryList && data.item.locationCategoryList.length > 0){
        const newItem = data.item.locationCategoryList.map(category => ({
          label: category.categoryName,
          value: category.categoryId,
        }));
        setItems(newItem);
      }
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
  }

  const viewContribution = (item) => {
    if(item.contributionStatus != 'WAIT_FOR_ACCEPT') return;
    setContributionId(item.contributionId);
    if(item.contributionType == 'BUILDING') {
      setName(item.name);
      setOfficialCode(item.officialCode);
      setBuildingAlias(item.alias);
      setMaxFloor(item.maxFloor.toString());
      setDescription(item.description);
      setBuildingContributionVisible(true);
    }
    else if(item.contributionType == 'LOCATION') {
      setCategory();
      setName(item.name);
      setFloor(item.floor.toString());
      setRoomNumber(item.roomNumber);
      setDescription(item.description);
      setLocationContributionVisible(true);
      setCategoryId(item.contributionLocationCategoryId);
      setValue(categoryId);
    }
  }

  const withdrawContribution = async() => {
    await fetch(`http://121.184.96.94:7070/api/v1/contribution/${contributionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
    .then(data => {
      if(data.item && data.item.success) console.log(data.item.success);
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
    setState(contributionId);
    setBuildingContributionVisible(false);
    setLocationContributionVisible(false);
  }

  return (
    <View style={styles.container}>
        <Text style={{fontSize: fontPercentage(22), alignSelf: 'flex-start', marginLeft: widthPercentage(30), marginTop: heightPercentage(50)}}>My Contribution</Text>
        <FlatList data={contributionData} renderItem={({item, index}) => {
          let formattedDate = '';
          if (item.createdAt) {
            try {
              const timestamp = new Date(item.createdAt);
              if (!isNaN(timestamp)) {
                formattedDate = timestamp.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              } else {
                formattedDate = 'Invalid Date';
              }
            } catch (error) {
              console.error('Error: ', error.message);
              formattedDate = 'Error';
            }
          }

          let statusImage;
          let statusStyle;
          switch (item.contributionStatus) {
            case 'WAIT_FOR_ACCEPT':
              statusImage = require('./assets/images/Wait.png');
              statusStyle = styles.pending;
              break;
            case 'ACCEPTED':
              statusImage = require('./assets/images/check.png');
              statusStyle = styles.approved;
              break;
            case 'REJECTED':
              statusImage = require('./assets/images/cross.png');
              statusStyle = styles.rejected;
              break;
            default:
              statusImage = require('./assets/images/badge.png');
              statusStyle = styles.default;
              break;
          }
          return(
            <Pressable style={[styles.contributionlist, {flexDirection: 'row'}]} onPress={() => viewContribution(item)}>
              <View>
                <Text style={{width: widthPercentage(218), fontSize: fontPercentage(16), fontWeight: 'bold'}}>{item.name}{item.contributionType=='BUILDING' ? ` (${item.officialCode})` : ''}</Text>
                <Text style={{marginTop: heightPercentage(10)}}>{formattedDate}</Text>
              </View>
              <View style={statusStyle}><Image source={statusImage} style={{width: heightPercentage(30), height: heightPercentage(30)}}/></View>
            </Pressable>
          )
        }
          }/>
      <Modal visible={locationContributionVisible} transparent={true}>
        <View style={styles.contribution}>
          <View>
            <Text style={{fontWeight: 'bold', fontSize:fontPercentage(20)}}>Contribute</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style={styles.unselectedStyle}>
                <Text style={{color: "#FFFFFF"}}>Building</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectedStyle}>
                <Text style={{color: "#FFFFFF"}}>Location</Text>
              </TouchableOpacity>
            </View>
            <Text>Location Name</Text>
            <TextInput style={styles.contribute_input} placeholder='Location Name' value={name} onChangeText={(text) => setName(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Floor</Text>
            <TextInput style={styles.contribute_input} placeholder='Floor' value={floor} onChangeText={(text) => setFloor(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Category</Text>
            <DropDownPicker style={{marginTop: heightPercentage(10)}} open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} />
            <Text style={{marginTop: heightPercentage(10)}}>Room Number</Text>
            <TextInput style={styles.contribute_input} placeholder='Room Number' value={roomNumber} onChangeText={(text) => setRoomNumber(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Description</Text>
            <TextInput style={styles.contribute_input} placeholder='Description' value={description} onChangeText={(text) => setDescription(text)}/>
          </View>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <TouchableOpacity style={styles.submit_contribution} onPress={() => setLocationContributionVisible(false)}>
              <Text style={{color:'white'}}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submit_contribution, {backgroundColor:"#EA4A27"}]} onPress={() => withdrawContribution()}>
              <Text style={{color:'white'}}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={buildingContributionVisible} transparent={true}>
        <View style={styles.contribution}>
          <View>
            <Text style={{fontWeight: 'bold', fontSize:fontPercentage(20)}}>Contribute</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style={styles.selectedStyle}>
                <Text style={{color: "#FFFFFF"}}>Building</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.unselectedStyle}>
                <Text style={{color: "#FFFFFF"}}>Location</Text>
              </TouchableOpacity>
            </View>
            <Text>Building Name</Text>
            <TextInput style={styles.contribute_input} placeholder='Building Name' value={name} onChangeText={(text) => setName(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Official Code (ex. E3-1)</Text>
            <TextInput style={styles.contribute_input} placeholder='Official Code' value={officialCode} onChangeText={(text) => setOfficialCode(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Building Alias</Text>
            <TextInput style={styles.contribute_input} placeholder='Building Alias' value={buildingAlias} onChangeText={(text) => setBuildingAlias(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Max Floor</Text>
            <TextInput style={styles.contribute_input} placeholder='Max Floor' value={maxFloor} onChangeText={(text) => setMaxFloor(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Description</Text>
            <TextInput style={styles.contribute_input} placeholder='Description' value={description} onChangeText={(text) => setDescription(text)}/>
          </View>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <TouchableOpacity style={styles.submit_contribution} onPress={() => setBuildingContributionVisible(false)}>
              <Text style={{color:'white'}}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submit_contribution, {backgroundColor:"#EA4A27"}]} onPress={() => withdrawContribution()}>
              <Text style={{color:'white'}}>Withdraw</Text>
            </TouchableOpacity>
          </View>
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
  contributionlist: {
    width: widthPercentage(327),
    height: heightPercentage(80),
    padding: heightPercentage(15),
    backgroundColor: "#FFEFEF",
    borderRadius: 10,
    alignItems: 'center',
    marginTop: widthPercentage(20)
  },
  pending: {
    width: heightPercentage(50),
    height: heightPercentage(50),
    borderRadius: heightPercentage(50)/2,
    backgroundColor: '#EABF27',
    alignItems: 'center',
    justifyContent: 'center'
  },
  approved: {
    width: heightPercentage(50),
    height: heightPercentage(50),
    borderRadius: heightPercentage(50)/2,
    backgroundColor: '#2792EA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rejected: {
    width: heightPercentage(50),
    height: heightPercentage(50),
    borderRadius: heightPercentage(50)/2,
    backgroundColor: '#EA4A27',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contribution:{
    padding: 20,
    margin: heightPercentage(30),
    backgroundColor: 'white',
    width: widthPercentage(349),
    height: heightPercentage(650),
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
  contribute_input: {
    borderWidth:1,
    borderRadius:5,
    height: heightPercentage(50),
    marginTop: heightPercentage(10),
    padding: widthPercentage(10)
  },
  submit_contribution: {
    width: widthPercentage(109),
    height: heightPercentage(40),
    backgroundColor: "#2080D0",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightPercentage(25),
    margin: heightPercentage(20)
  },
  close_btn : {
    width: widthPercentage(270),
    height: heightPercentage(45),
    backgroundColor: "#666666",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    marginTop: heightPercentage(0),
    margin: heightPercentage(20)
  }
});
