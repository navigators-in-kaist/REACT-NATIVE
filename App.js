import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Restaurant from './categories/Restaurant';
import Drawer from './Drawer'


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Drawer" component={Drawer} options={{headerShown : false}}/>
        <Stack.Screen name="Restaurant" component={Restaurant} options={{headerShown : false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
