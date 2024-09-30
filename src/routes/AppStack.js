import { createStackNavigator } from '@react-navigation/stack';

import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet } from 'react-native';
import AuthStackNavigator from './AuthStack';
import RegistrationNavigator from './RegistrationStack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabNavigator from './BottomTab';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDataToStore } from '../store/slices/loginSlice';
import { getUserDataSelector } from '../store/selectors';
import { parse } from 'react-native-svg';
import DrawerStack from './DrawerStack';

const Stack = createStackNavigator();
const AppStack = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector(getUserDataSelector);

  useEffect(() => {
    getUserDataFromSecureStore();
  }, []);

  useEffect(() => {
    if (userData.userToken != null) {
      setIsLoggedIn(true);
    }
  }, [userData]);

  const getUserDataFromSecureStore = async () => {
    setIsLoading(true);
    let token = await SecureStore.getItemAsync('userToken');
    let id = await SecureStore.getItemAsync('userId');
    let name = await SecureStore.getItemAsync('userName');
    let email = await SecureStore.getItemAsync('userEmail');
    let roleId = await SecureStore.getItemAsync('userRoleId');
    let mobile = await SecureStore.getItemAsync('userMobile');
    if (token != null) {
      await dispatch(
        setUserDataToStore({
          userId: parseInt(id),
          userName: name,
          userEmail: email,
          userRoleId: parseInt(roleId),
          userMobile: mobile,
          userToken: token,
        }),
      );
    }
    setIsLoading(false);
  };
  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <Stack.Screen
          name="Auth"
          component={AuthStackNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Drawer"
            component={DrawerStack}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
