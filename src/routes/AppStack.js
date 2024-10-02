// In your AppStack.js
import React, { useEffect,useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../store/selectors';
import AuthStackNavigator from './AuthStack';
import DrawerStack from './DrawerStack';

const Stack = createStackNavigator();

const AppStack = () => {
  const userData = useSelector(getUserDataSelector);
  

 const [isLoggedIn, setIsLoggedIn] =useState(null);


  useEffect(()=>{
    console.log('hi')
  setIsLoggedIn(userData.userToken)
  },[userData])


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Drawer" component={DrawerStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppStack;