import React, { useEffect, useMemo, useState } from 'react';
import { Button, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { widthPercentage, heightPercentage, fontPercentage } from './Main';
import DropDownPicker from 'react-native-dropdown-picker';
import { useToken } from './Token'
import RouteSvg from './assets/images/route.svg';
import UnsavedSvg from './assets/images/unsaved.svg';
import SearchIconSvg from './assets/images/search-icon.svg';
import RecentSvg from './assets/images/recent.svg';
import DeleteSvg from './assets/images/delete.svg';
import LineSvg from './assets/images/line.svg';
import BackButtonSvg from './assets/images/back-button.svg';
import SwitchSvg from './assets/images/switch.svg';
import MyLocationSvg from './assets/images/my-location.svg';
import TargetLocationSvg from './assets/images/target-location.svg';
import CurrentLocationSvg from './assets/images/CurrentLocation.svg';
import SavedSvg from './assets/images/Saved.svg';

export default function Map() {
  const [marker, setMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [searchHistoryData, setSearchHistoryData] = useState([]);
  const [searchedLocationData, setSearchedLocationData] = useState([]);
  const [searchedBuildingData, setSearchedBuildingData] = useState([]);
  const [contributionVisible, setContributionVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [floorOpen, setFloorOpen] = useState(false);
  const [floorValue, setFloorValue] = useState(null);
  const [floorItems, setFloorItems] = useState([]);
  const [isVisible, setVisibility] = useState(true);
  const [autoVisible, setAutoVisibility] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [targetLongitude, setTargetLongitude] = useState(null);
  const [targetLatitude, setTargetLatitude] = useState(null);
  const accessToken = useToken();
  const route = useRoute();
  const [currentLocation, setCurrentLocation] = useState(null); //null로 바꿀 것
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null); //null로 바꿀 것
  const [routingFeature, setRoutingFeature] = useState([]);
  const [routingPath, setRoutingPath] = useState([]);
  const [estimatedDistance, setEstimatedDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [startPosition, setStartPosition] = useState('My Location');
  const [locationNameForContribution, setLocationNameForContribution] = useState('');
  const [descriptionForContribution, setDescriptionForContribution] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [floor, setFloor] = useState(null);
  const [roomnumber, setRoomnumber] = useState('');
  const [buildingContributionVisible, setBuildingContributionVisible] = useState(false);
  const [buildingAlias, setBuildingAlias] = useState('');
  const [officialCode, setOfficialCode] = useState('');
  const [maxFloor, setMaxFloor] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [kind, setKind] = useState('');
  
  useEffect(() => {
    if (route.params?.action === 'searchByCategory') {
      searchByCategory(route.params.params);
    }
  }, [route.params]);

  useEffect(() => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        if(!location){
          console.error('Error: Unable to get current location');
          return;
        }
        if(location.coords){
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
        }

    })();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      setCurrentLocationMarker(currentLocation);
    }
  }, [currentLocation])

  const searchByCategory = (payload) => {
    searchLocationResult(payload);
  }

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
  }

  const pressingSearch = async () => {
    await fetch('http://121.184.96.94:7070/api/v1/search/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
    },
    }).then(response => response.json())
    .then(data => {
      if(data.item && data.item.histories) setSearchHistoryData(data.item.histories);
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
    setAutoVisibility(true);
  }

  const deleteHistory = async (event, historyId) => {
    event.stopPropagation();
    await fetch(`http://121.184.96.94:7070/api/v1/search/history/${historyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
    .then(data => console.log(data.item.success))
    .catch((error) => {
      console.error('Error: ', error);
    })
    pressingSearch();
  }

  const getSearchResult = async () => {
    if(search == '') return;
    await fetch(`http://121.184.96.94:7070/api/v1/search?payload=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
    .then(data => {
      setSearchedLocationData(data.item.locationResults);
      setSearchedBuildingData(data.item.buildingResults);
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
    setSearchModalVisible(true);
  }

  const searchHistoryResult = (item) => {
    if(item.type == 'building'){
      const payload = {buildingId: `${item.searchHistoryBuildingId}`};
      searchBuildingResult(payload);
    }
    else{
      const payload = {locationId: `${item.searchHistoryLocationId}`};
      searchLocationResult(payload);
    }
  }

  const searchBuildingResult = async (item) => {
    await fetch(`http://121.184.96.94:7070/api/v1/building/${item.buildingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
    .then(data => {
      if(data.item){
        setName(`${data.item.buildingName} (${data.item.officialCode})`)
        setDescription(data.item.description);
        setImages(data.item.imageList);
        setTargetLongitude(data.item.longitude);
        setTargetLatitude(data.item.latitude);
        setBuildingId(data.item.buildingId);
        setFloor(data.item.maxFloor);
        setIsSaved(data.item.isSaved);
      }
      else console.log(data)
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
    setKind('building');
    setSearchModalVisible(false);
    setModalVisible(true);
  }

  const searchLocationResult = async (item) => {
    await fetch(`http://121.184.96.94:7070/api/v1/location/${item.locationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
    .then(data => {
      setName(`${data.item.locationName} (${data.item.locationBuildingOfficialCode})${data.item.floor && data.item.floor !== 'undefined' ? ` - ${data.item.floor} floor` : ''}`)
      setDescription(data.item.description);
      setImages(data.item.imageList);
      setTargetLongitude(data.item.longitude);
      setTargetLatitude(data.item.latitude);
      setBuildingId('');
      setLocationId(data.item.locationId);
      setIsSaved(data.item.isSaved);
    })
    setKind('location');
    setSearchModalVisible(false);
    setModalVisible(true);
  }

  const goBacktoDefaultMap = () => {
    setVisibility(true);
    setRoutingPath([]);
  }

  const switchNavigation = () => {
    const switch_name = startPosition;
    setStartPosition(name);
    setName(switch_name);
  }

  const doRouting = async (latitude, longitude) => {
    setVisibility(false);
    setModalVisible(false);
    setStartPosition('My Location');
    const routeData = {
      fromLongitude: currentLocation.longitude,
      fromLatitude: currentLocation.latitude,
      toLongitude: longitude,
      toLatitude: latitude
    };
    await fetch(`http://121.184.96.94:7070/api/v1/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(routeData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.item && data.item.features && data.item.features.length > 0) {
        const routingFeature = data.item.features;
        setRoutingFeature(routingFeature);
    
        if (routingFeature[0].properties && routingFeature[0].properties.totalDistance) {
          setEstimatedDistance(routingFeature[0].properties.totalDistance);
          setEstimatedTime(Math.round(routingFeature[0].properties.totalTime / 60));
    
          const newPath = [{ latitude: routingFeature[0].geometry.coordinates[1], longitude: routingFeature[0].geometry.coordinates[0] }];
          for (let i = 0; i < routingFeature.length; i++) {
            if (routingFeature[i].geometry.type === 'LineString') {
              for (let j = 1; j < routingFeature[i].geometry.coordinates.length; j++) {
                newPath.push({ latitude: routingFeature[i].geometry.coordinates[j][1], longitude: routingFeature[i].geometry.coordinates[j][0] });
              }
            }
          }
          setRoutingPath(newPath);
        }
      } else {
        console.error('Error: Invalid response data structure');
      }
    })
    .catch((error) => {
      console.error('Error fetching route:', error);
    });
  }
  
  const submitLocationContribution = async (locationName, locationFloor, description, roomNumber, locationCategoryId, locationBuildingId) => {
    if(!locationName || !locationFloor || !description || !locationCategoryId || !locationBuildingId){
      alert("All information except room number are necessary");
      return;
    }
    const locationData = {
      locationName : locationName,
      locationFloor : locationFloor,
      description : description,
      roomNumber : roomNumber,
      locationCategoryId : locationCategoryId,
      locationBuildingId : locationBuildingId
    }
    await fetch('http://121.184.96.94:7070/api/v1/contribution/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(locationData),
    }).then(response => response.json())
    .then(data => {
      if(data.item && data.item.success) console.log(data.item.success);
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
    setFloorValue(null);
    setValue(null);
    setContributionVisible(false);
    setLocationNameForContribution('');
    setDescriptionForContribution('');
    setRoomnumber('')
  }

  const submitBuildingContribution = async (officialCode, buildingName, buildingAlias, description, maxFloor, longitude, latitude) => {
    if(!officialCode || !buildingName || !buildingAlias || !description || !maxFloor || !longitude || !latitude){
      alert("You have missing information");
      return;
    }
    await fetch(`http://121.184.96.94:7070/api/v1/contribution/building/official-code?payload=${officialCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
    .then(data => {
      if(data && data.item && data.item.isDuplicated){
        console.log(data.item.isDuplicated);
        if(data.item.isDuplicated == true){
          alert("Duplicate official code exist");
          return;
        }
      };
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
    const buildingData = {
      officialCode : officialCode,
      buildingName : buildingName,
      buildingAlias : buildingAlias,
      description : description,
      maxFloor : parseInt(maxFloor),
      longitude : longitude,
      latitude: latitude
    }
    await fetch('http://121.184.96.94:7070/api/v1/contribution/building', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'KAuthorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(buildingData),
    }).then(response => response.json())
    .then(data => {
      if(data && data.item && data.item.success) console.log(data.item.success);
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
    setOfficialCode('');
    setLocationNameForContribution('');
    setBuildingAlias('');
    setDescriptionForContribution('');
    setMaxFloor('');
    setBuildingContributionVisible(false);
  }

  const generateItems = (num) => {
    let newItems = [];
    for (let i = 1; i <= num; i++) {
      newItems.push({ label: `${i}`, value: `${i}` });
    }
    return newItems;
  };

  const goContribute = async () => {
    setFloorItems(generateItems(floor));
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
    setContributionVisible(true);
  }
  
  const changeSaveState = async () => {
    if(isSaved) {
      const savedData = {
        kind: kind,
        id: kind === 'building' ? buildingId : locationId
      };
      await fetch('http://121.184.96.94:7070/api/v1/save/undo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'KAuthorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(savedData),
      }).then(response => response.json())
      .then(data => {
        if(data && data.item && data.item.success) console.log(data.item.success);
      })
      .catch((error) => {
        console.error('Error: ', error);
      })
      setIsSaved(false);
    }
    else {
      const unSavedData = {
        kind: kind,
        id: kind === 'building' ? buildingId : locationId
      };
      await fetch('http://121.184.96.94:7070/api/v1/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'KAuthorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(unSavedData),
      }).then(response => response.json())
      .then(data => {
        if(data && data.item && data.item.success) console.log(data.item.success);
      })
      .catch((error) => {
        console.error('Error: ', error);
      })
      setIsSaved(true);
    }
  }

  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={currentLocation ? {latitude:currentLocation.latitude, longitude:currentLocation.longitude, latitudeDelta:0.01, longitudeDelta:0.01} : {latitude:0, longitude:0, latitudeDelta:0.01, longitudeDelta:0.01}} onPress={handleMapPress}>
        {marker && <Marker coordinate={marker} onPress={() => setBuildingContributionVisible(true)}/>}
        {currentLocationMarker && <Marker coordinate={currentLocationMarker}/>}
        {!isVisible && (<Polyline
          coordinates={routingPath}
          strokeColor="#50BCDF" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={widthPercentage(3)}
        />)}
      </MapView>
      <View style={[styles.autosearch, {display: isVisible ? 'flex' : 'none'}]}>
        <View style={styles.searchbox}>
          <SearchIconSvg width={widthPercentage(20)} height={widthPercentage(20)}/>
          <View style={{flex:1}}>
            <TextInput style = {styles.input} onChangeText={(text) => setSearch(text)} value={search} placeholder='Search' onFocus={pressingSearch} onBlur={getSearchResult}></TextInput>
          </View>
          <Pressable onPress={() => setSearch('')}><DeleteSvg width={widthPercentage(20)} height={widthPercentage(20)}/></Pressable>
        </View>
        <FlatList style={{display: autoVisible ? 'flex' : 'none'}} data={searchHistoryData} renderItem={({item, index}) => 
            <Pressable style={[styles.searchedlist, {flexDirection: 'row'}]} onPress={() => searchHistoryResult(item)}>
              <RecentSvg width={15} height={15}/>
              <View style={{marginLeft: 10, flex:1}}><Text style={{flexShrink: 1}}>{item.name} ( {item.officialCode} )</Text></View>
              <Pressable onPress={(event) => deleteHistory(event, item.historyId)}><DeleteSvg style={{marginLeft:10, marginRight: 10}} width={10} height={10} /></Pressable>
            </Pressable>
          }/>
      </View>
      <View style={[styles.routing, {display: !isVisible ? 'flex' : 'none'}]}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => goBacktoDefaultMap()}>
            <BackButtonSvg style={{marginTop: heightPercentage(7.5)}} width={widthPercentage(29)} height={heightPercentage(24)} onPress={() => goBacktoDefaultMap()}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchNavigation()}>
            <SwitchSvg style={{marginTop: heightPercentage(35)}} width={heightPercentage(40)} height={heightPercentage(40)}/>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.routingsearchbox}>
            <MyLocationSvg width={25} height={25}/>
            <Text style={{marginLeft:10}}>{startPosition}</Text>
          </View>
          <LineSvg style={{marginLeft:15}} width={10} height={20}/>
          <View style={styles.routingsearchbox}>
            <TargetLocationSvg width={25} height={25}/>
            <Text style={{marginLeft:10}}>{name}</Text>
          </View>
          <View style={{marginTop: heightPercentage(10), backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 10, padding: 5}}>
            <Text style={{marginLeft: widthPercentage(10)}}>Distance: {estimatedDistance}m</Text>
            <Text style={{marginLeft: widthPercentage(10)}}>Estimated Time: {estimatedTime}</Text>
          </View>
        </View>
      </View>
      {/*search result*/}
      <Modal transparent={true} visible={searchModalVisible}>
        <View style={{position:'absolute', bottom:0, backgroundColor:'white', height:'auto', width:'100%'}}>
          <Text style={{margin: widthPercentage(10), fontSize: fontPercentage(18)}}>Search Result</Text>
          <FlatList data={searchedLocationData} renderItem={({item, index}) => 
            <Pressable style={[styles.searchedlist, {flexDirection: 'row'}]} onPress={() => searchLocationResult(item)}>
              <View style={{flex:1}}><Text style={{flexShrink: 1}}>{index+1}. {item.locationName} ( {item.locationBuildingOfficialCode} )</Text></View>
            </Pressable>
          }/>
          <FlatList data={searchedBuildingData} renderItem={({item, index}) => 
            <Pressable style={[styles.searchedlist, {flexDirection: 'row'}]} onPress={() => searchBuildingResult(item)}>
              <View style={{flex:1}}><Text style={{flexShrink: 1}}>{searchedLocationData.length+index+1}. {item.buildingName} ( {item.officialCode} )</Text></View>
            </Pressable>
          }/>
          <View>
            <Button title='close' onPress={() => setSearchModalVisible(false)}/>
          </View>
        </View>
      </Modal>
      {/*detailed search result*/}
      <Modal transparent={true} visible={modalVisible}>
        <View style={{position:'absolute', bottom:0, backgroundColor:'white', height:'auto', width:'100%'}}>
          <View>
            <Text style={{fontSize: fontPercentage(18), marginLeft:heightPercentage(10), marginTop: heightPercentage(10)}}>{name}</Text>
            <Text style={{marginLeft:heightPercentage(10), color:'#8f8f8f'}}>{description}</Text>
            <FlatList style={{marginLeft:heightPercentage(10), marginTop:heightPercentage(10)}} data={images} horizontal={true} renderItem={({item, index}) => 
              <Image style ={{width:heightPercentage(100), height:heightPercentage(100), borderRadius:10, marginRight:widthPercentage(10)}} source={{uri: `${item.imgUrl}`}} resizeMode='cover'/>
            }/>
            <View style={{flexDirection:'row', justifyContent: 'center'}}>
              <TouchableOpacity style={styles.btn} onPress={() => doRouting(targetLatitude, targetLongitude)}>
                <RouteSvg width={20} height={20} />
                <Text style={styles.btn_txt}>Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => changeSaveState()}>
                {isSaved ? <SavedSvg width={20} height={20} /> : <UnsavedSvg width={20} height={20} />}
                <Text style={styles.btn_txt}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, {display: buildingId ? 'flex' : 'none'}]} onPress={() => goContribute()}>
                <Image source={require('./assets/images/add.png')} style={{width:heightPercentage(20), height: heightPercentage(20)}}/>
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
            <TextInput style={styles.contribute_input} placeholder='Location Name' value={locationNameForContribution} onChangeText={(text) => setLocationNameForContribution(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Floor</Text>
            <DropDownPicker style={{marginTop: heightPercentage(10)}} zIndex={5000} open={floorOpen} value={floorValue} items={floorItems} setOpen={setFloorOpen} setValue={setFloorValue} setItems={setFloorItems} />
            <Text style={{marginTop: heightPercentage(10)}}>Category</Text>
            <DropDownPicker style={{marginTop: heightPercentage(10)}} zIndex={1000} open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} />
            <Text style={{marginTop: heightPercentage(10)}}>Room Number</Text>
            <TextInput style={styles.contribute_input} placeholder='Room Number' value={roomnumber} onChangeText={(text) => setRoomnumber(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Description</Text>
            <TextInput style={styles.contribute_input} placeholder='Description' value={descriptionForContribution} onChangeText={(text) => setDescriptionForContribution(text)}/>
          </View>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <TouchableOpacity style={styles.submit_contribution} onPress={() => submitLocationContribution(locationNameForContribution, floor, descriptionForContribution, roomnumber, value, buildingId)}>
              <Text style={{color:'white'}}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submit_contribution, {backgroundColor:"#EA4A27"}]} onPress={() => setContributionVisible(false)}>
              <Text style={{color:'white'}}>Close</Text>
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
            <TextInput style={styles.contribute_input} placeholder='Building Name' value={locationNameForContribution} onChangeText={(text) => setLocationNameForContribution(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Official Code (ex. E3-1)</Text>
            <TextInput style={styles.contribute_input} placeholder='Official Code' value={officialCode} onChangeText={(text) => setOfficialCode(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Building Alias</Text>
            <TextInput style={styles.contribute_input} placeholder='Building Alias' value={buildingAlias} onChangeText={(text) => setBuildingAlias(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Max Floor</Text>
            <TextInput style={styles.contribute_input} placeholder='Max Floor' value={maxFloor} onChangeText={(text) => setMaxFloor(text)}/>
            <Text style={{marginTop: heightPercentage(10)}}>Description</Text>
            <TextInput style={styles.contribute_input} placeholder='Description' value={descriptionForContribution} onChangeText={(text) => setDescriptionForContribution(text)}/>
          </View>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <TouchableOpacity style={styles.submit_contribution} onPress={() => submitBuildingContribution(officialCode, locationNameForContribution, buildingAlias, descriptionForContribution, maxFloor, marker.longitude, marker.latitude)}>
              <Text style={{color:'white'}}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submit_contribution, {backgroundColor:"#EA4A27"}]} onPress={() => setBuildingContributionVisible(false)}>
              <Text style={{color:'white'}}>Close</Text>
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
    flexDirection: 'row',
  },
  searchedlist: {
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
  contribution:{
    padding: 20,
    margin: heightPercentage(35),
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
  contribute_input: {
    borderWidth:1,
    borderRadius:5,
    height: heightPercentage(50),
    marginTop: heightPercentage(10),
    padding: widthPercentage(10)
  }
});
