import React from 'react';
import Profile from './Profile';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem  } from '@react-navigation/drawer';
import Appnavigator from './Navigation';
import { Text, View, Image, StyleSheet } from 'react-native';
import Report from './Report';
import { fontPercentage, heightPercentage, widthPercentage } from './Main';
import SettingSvg from './assets/images/settings.svg';
import LogoutSvg from './assets/images/logout.svg'

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
            icon={() => <LogoutSvg width={heightPercentage(20)} height={heightPercentage(20)} />}
            style={styles.logoutButton}
            labelStyle = {{fontSize:fontPercentage(10), color:"#AA0000"}}
          />
      </View>
    );
  }

export default function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={({route}) => ({
        drawerIcon: ({ focused, size }) => {
            let IconComponent;

            if(route.name === 'Contributions') {
              return <Image source={require('./assets/images/contributions.png')} />;
            } else if(route.name === 'Saved') {
              return <Image source={require('./assets/images/saved.png')} />;
            } else if(route.name === 'Settings') {
              IconComponent = SettingSvg;
            } else if(route.name === 'Report') {
              return <Image source={require('./assets/images/report.png')} />;
            } else {
              return <Image source={require('./assets/images/faq.png')} />;
            }

            return <IconComponent width={20} height={20} />;
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
    marginBottom:20,
  },
});
