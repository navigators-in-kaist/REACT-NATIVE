import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from './Map';
import Main from './Main';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Main">
      <Tab.Screen name="Main" component={Main} options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
            headerShown : false
          }}/>
      <Tab.Screen name="Map" component={Map} options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="map" color={color} size={size} />
            ),
            headerShown : false
          }}/>
      <Tab.Screen name="Profile" component={Profile} options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="account-circle" color={color} size={size} />
            ),
            headerShown : false
          }}/>
    </Tab.Navigator>
  );
}

export default function () {
    return (
      <MyTabs />
    );
  }