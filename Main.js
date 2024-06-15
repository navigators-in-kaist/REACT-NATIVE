import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { responsiveScreenHeight, responsiveScreenWidth, responsiveScreenFontSize } from 'react-native-responsive-dimensions';
import { useToken } from './Token'
import SearchIconSvg from './assets/images/search-icon.svg';

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
    const accessToken = useToken();
    const [categoryData, setCategoryData] = useState([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchbox}>
      <SearchIconSvg width={20} height={20}/>
        <TextInput style = {styles.input} onChangeText={text => setSearch(text)} value={search} placeholder='Search'></TextInput>
      </View>
        <Text style={styles.text}>Category</Text>
        <View style={styles.categories}>
          <TouchableOpacity onPress={() => navigation.navigate('Category_Location', {id:'2f5d8135-cefc-4d68-bde5-2ae78a9ba65c', name:'Restaurants'})}>
          <View style={styles.category}>
            <ImageBackground source={require('./assets/images/restaurant.png')} resizeMode="cover" style={styles.category_image}>
              <Text style={styles.place}>Restaurants</Text>
            </ImageBackground>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Category_Location', {id:'bffe8471-31b0-4695-9907-7bf77f0069f8', name:'Convenience Stores'})}>
          <View style={styles.category}>
            <ImageBackground source={require('./assets/images/convenience-store.png')} rtesizeMode="cover" style={styles.category_image}>
              <Text style={styles.place}>Convenience Stores</Text>
            </ImageBackground>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Category_Location', {id:'a8a67e35-b956-4f4b-a00d-215ed958834a', name:'Cafes'})}>
          <View style={styles.category}>
            <ImageBackground source={require('./assets/images/cafe.png')} resizeMode="cover" style={styles.category_image}>
            <Text style={styles.place}>Cafes</Text>
            </ImageBackground>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Category_Location', {id:'b06781df-1703-4fd1-81c7-3ae8ffe97016', name:'Gyms'})}>
          <View style={styles.category}>
            <ImageBackground source={require('./assets/images/gym.png')} resizeMode="cover" style={styles.category_image}>
              <Text style={styles.place}>Gyms</Text>
            </ImageBackground>
          </View>
          </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Category_Location', {id:'8916ab2a-224d-41d9-89be-84b1af520fef', name:'Dormitories'})}>
          <View style={styles.category}>
            <ImageBackground source={require('./assets/images/dormitory.png')} resizeMode="cover" style={styles.category_image}>
              <Text style={styles.place}>Dormitories</Text>
            </ImageBackground>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Category_Location', {id:'0969b176-d2f7-4e18-93d1-1f977222c965', name:'Coworking Spaces'})}>
          <View style={styles.category}>
            <ImageBackground source={require('./assets/images/coworking-space.png')} resizeMode="cover" style={styles.category_image}>
              <Text style={styles.place}>Coworking Spaces</Text>
            </ImageBackground>
          </View>
          </TouchableOpacity>
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
    marginTop:heightPercentage(50),
  },
  logo: {
    width: heightPercentage(20),
    height: heightPercentage(20)
  },
  input: {
    width: '100%',
    height: heightPercentage(41),
    padding: 10,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  text: {
    fontSize: fontPercentage(22),
    marginTop: heightPercentage(20),
    marginBottom: heightPercentage(10),
    fontWeight: 'bold'
  },
  category: {
    margin: heightPercentage(10),
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