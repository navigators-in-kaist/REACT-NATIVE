import React from 'react';
import Profile from './Profile';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem  } from '@react-navigation/drawer';
import Appnavigator from './Navigation';
import { Text, View, Image, StyleSheet } from 'react-native';
import Report from './Report';
import { fontPercentage } from './Main';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
      <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.profile}>
          <Image style={styles.profileImage} source={require('./assets/images/nupjuk.png')}></Image>
          <Text style={styles.welcomeText}>Hi, Nupjuk!</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
            label="Logout"
            icon={() => <Image source={require('./assets/images/logout.png')}/>}
            activeTintColor='#AA0000'
            inactiveTintColor='#AA0000'
            style={styles.logoutButton}
          />
      </View>
    );
  }

export default function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={({route}) => ({
        drawerIcon: ({ focused, size }) => {
            let iconSource;

            if(route.name === 'Contributions') {
                iconSource = require('./assets/images/contributions.png');
            } else if(route.name === 'Saved') {
                iconSource = require('./assets/images/saved.png');
            } else if(route.name === 'Settings') {
                iconSource = require('./assets/images/settings.png');
            } else if(route.name === 'Report') {
                iconSource = require('./assets/images/report.png');
            } else {
                iconSource = require('./assets/images/faq.png');
            }

            return <Image source={iconSource} />;
        },
    })}>
      <Drawer.Screen name="Home" component={Appnavigator} options={{headerShown : false}}/>
      <Drawer.Screen name="Contributions" component={Profile} options={{headerShown : false}}/>
      <Drawer.Screen name="Saved" component={Profile} options={{headerShown : false}}/>
      <Drawer.Screen name="Settings" component={Profile} options={{headerShown : false}}/>
      <Drawer.Screen name="Report" component={Report} options={{headerShown : false}}/>
      <Drawer.Screen name="FAQ" component={Profile} options={{headerShown : false}}/>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profileImage: {
      borderWidth: 1,
      borderColor: '#000000',
  },
  welcomeText: {
      fontSize: fontPercentage(20),
      marginBottom:10
  },
  profile : {
    margin: 20,
    borderBottomWidth: 1,
    borderColor: '#f4f4f4',
  },
  container : {
    flex:1
  },
  logoutButton : {
    marginLeft:10,
    marginBottom:20
  },
});
