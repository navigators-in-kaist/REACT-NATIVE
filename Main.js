import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { responsiveScreenHeight, responsiveScreenWidth, responsiveScreenFontSize } from 'react-native-responsive-dimensions'
import {weather_API_Key} from "@env"

const FIGMA_WINDOW_WIDTH = 393;
const FIGMA_WINDOW_HEIGHT = 852;

export function widthPercentage(width) {
  const percentage = (width / FIGMA_WINDOW_WIDTH) * 100;

  return responsiveScreenWidth(percentage);
}

export function heightPercentage(height) {
  const percentage = (height / FIGMA_WINDOW_HEIGHT) * 100;

  return responsiveScreenHeight(percentage);
}

export function fontPercentage(size) {
  const percentage = size * 0.135;

  return responsiveScreenFontSize(percentage);
}

export default function Main({navigation}) {
    const [search, setSearch] = useState('');
    const { height, width } = useWindowDimensions();
    const [temp, setTemp] = useState('');
    const [weather, setWeather] = useState('');
    const getWeather = async() => {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=36.372141&lon=127.360651&appid=${weather_API_Key}`);
      const data = await response.json();
      setTemp(Math.round(data.main.temp)/10);
      setWeather(data.weather[0].icon);
    }

    getWeather();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchbox}>
        <Image style = {styles.logo} source={require('./assets/images/search-icon.png')}></Image>
        <TextInput style = {styles.input} onChangeText={text => setSearch(text)} value={search} placeholder='Search'></TextInput>
      </View>
      <View style={styles.weatherContainer}>
        <View style={{alignItems:'flex-start', justifyContent:'center', flex:1}}>
          <Text style={styles.temperature}>{temp}°</Text>
          <Text style={styles.date}>Apr 30, 2024</Text>
          <View style={styles.regionContainer}>
            <Image source={require('./assets/images/region.png')}/>
            <Text style={styles.region}>Kaist, Daejeon</Text>
          </View>
        </View>
        <Image style={{marginTop:5, marginRight:10, width:widthPercentage(60), height:widthPercentage(60)}} source={{uri: `http://openweathermap.org/img/w/${weather}.png`}}/>
      </View>
      <Text style={styles.text}>Category</Text>
      <View style={styles.categories}>
        <TouchableOpacity onPress={() => navigation.navigate('Restaurant')}>
        <View style={styles.category}>
          <ImageBackground source={require('./assets/images/restaurant.png')} resizeMode="cover" style={styles.category_image}>
            <Text style={styles.place}>Restaurants</Text>
            <Text style={styles.location_num}>8 Locations</Text>
          </ImageBackground>
        </View>
        </TouchableOpacity>
        <View style={styles.category}>
          <ImageBackground source={require('./assets/images/convenience-store.png')} rtesizeMode="cover" style={styles.category_image}>
            <Text style={styles.place}>Convenience Stores</Text>
            <Text style={styles.location_num}>9 Locations</Text>
          </ImageBackground>
        </View>
      </View>
      <View style={styles.categories}>
        <TouchableOpacity onPress={() => navigation.navigate('Cafe')}>
        <View style={styles.category}>
          <ImageBackground source={require('./assets/images/cafe.png')} resizeMode="cover" style={styles.category_image}>
          <Text style={styles.place}>Cafes</Text>
          <Text style={styles.location_num}>9 Locations</Text>
          </ImageBackground>
        </View>
        </TouchableOpacity>
        <View style={styles.category}>
          <ImageBackground source={require('./assets/images/gym.png')} resizeMode="cover" style={styles.category_image}>
            <Text style={styles.place}>Gyms</Text>
            <Text style={styles.location_num}>8 Locations</Text>
          </ImageBackground>
        </View>
      </View>
      <View style={styles.categories}>
        <View style={styles.category}>
          <ImageBackground source={require('./assets/images/dormitory.png')} resizeMode="cover" style={styles.category_image}>
            <Text style={styles.place}>Dormitories</Text>
            <Text style={styles.location_num}>9 Locations</Text>
          </ImageBackground>
        </View>
        <View style={styles.category}>
          <ImageBackground source={require('./assets/images/coworking-space.png')} resizeMode="cover" style={styles.category_image}>
            <Text style={styles.place}>Coworking Spaces</Text>
            <Text style={styles.location_num}>9 Locations</Text>
          </ImageBackground>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'center',
  },
  searchbox: {
    flexDirection: 'row',
    width: widthPercentage(323),
    height: heightPercentage(40),
    padding: 10,
    justifyContent : 'left',
    alignItems : 'center',
    borderColor: "#808080",
    borderWidth: 1,
    borderRadius: 10,
    marginTop:50,
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
  weatherContainer: {
    flexDirection: 'row',
    marginTop:10,
    width:widthPercentage(320),
    height:heightPercentage(98),
    borderRadius:10,
    borderWidth:1,
    borderColor:'#808080',
    justifyContent:'center',
  },
  temperature: {
    fontSize: fontPercentage(22),
    marginLeft: 20
  },
  date: {
    fontSize: fontPercentage(12),
    marginLeft: 20
  },
  regionContainer: {
    flexDirection: 'row',
    alignItems:'center',
    marginLeft: 20,
    marginTop:10
  },
  region: {
    fontSize: fontPercentage(10),
    marginLeft:5
  },
  categories: {
    flexDirection: 'row',
  },
  text: {
    fontSize:fontPercentage(22),
  },
  category: {
    margin: 10,
    width: heightPercentage(150),
    height: heightPercentage(150),
  },
  category_image: {
    width: heightPercentage(150),
    height: heightPercentage(150),
    justifyContent: 'flex-end'
  },
  place: {
    marginLeft: 10,
    marginBottom: 5,
    color: "#FFF",
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
    fontSize: fontPercentage(14),
  },
  location_num: {
    marginLeft: 10,
    marginBottom: 5,
    color: "#FFF",
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
    fontSize: fontPercentage(10),
  },
});