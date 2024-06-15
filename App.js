import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TokenProvider } from './Token';
import Category_Location from './Category_Location';
import Drawer from './Drawer';
import Start from './Start_Page';
import Login from './Login';
import Signup from './Signup';
import EditProfile from './EditProfile';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TokenProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown : false}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown : false}}/>
        <Stack.Screen name="Drawer" component={Drawer} options={{headerShown : false}}/>
        <Stack.Screen name="Category_Location" component={Category_Location} options={{headerShown : false}}/>
        <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown : false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </TokenProvider>
  );
}
