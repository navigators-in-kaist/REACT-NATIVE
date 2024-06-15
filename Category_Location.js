import React, {useState, useEffect} from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { fontPercentage, heightPercentage, widthPercentage } from './Main';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { useRoute } from '@react-navigation/native'
import { useToken } from './Token'
import MarkSvg from './assets/images/cat.svg'

export default function Category_Location({navigation}) {
  const [locationData, setLocationData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const route = useRoute();
  const { id } = route.params;
  const { name } = route.params;
  const token = useToken();

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
      const fetchData = async () => {
        const categoryId = id;
        try {
          const response = await fetch(`http://121.184.96.94:7070/api/v1/location/category/${categoryId}?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'KAuthorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setLocationData(data.item.locationList);
        } catch (error) {
          console.error('Error: ', error);
        }
      };

      fetchData();
    }
  }, [currentLocation, id, token])

  const searchLocation = (locationId) => {
    navigation.navigate('Map', {
      action: 'searchByCategory', // 실행할 액션의 이름 전달
      params: { locationId: locationId } // 필요에 따라 추가 매개변수도 전달 가능
    });
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize:fontPercentage(22), marginTop:heightPercentage(50), marginBottom:heightPercentage(20)}}>{name}</Text>
      <FlatList data={locationData} renderItem={({item, index}) =>
        <Pressable style={styles.list} onPress={() => searchLocation(item.locationId)}>
          <View style={styles.component}>
            <View style={{backgroundColor:'#FFEFEF', width: heightPercentage(80), height: heightPercentage(80), borderRadius: 10, alignItems: 'center', justifyContent:'center'}}>
              <MarkSvg width={heightPercentage(43)} height={heightPercentage(43)}/>
            </View>
            <View style={{marginLeft: widthPercentage(10)}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: fontPercentage(18), width:widthPercentage(190)}}>{item.locationName} ({item.locationBuildingOfficialCode})</Text>
                <Text style={{marginLeft:widthPercentage(10)}}>{Math.round(item.distanceFromCurrentPosition)} m</Text>
              </View>
              <Text style={{color: '#9F9F9F', marginTop: 5}}>{item.description}</Text>
            </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  component: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center'
  },
});