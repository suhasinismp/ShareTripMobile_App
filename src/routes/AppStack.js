import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../store/selectors';
import { setUserDataToStore } from '../store/slices/loginSlice';
import AuthStackNavigator from './AuthStack';
import DrawerStack from './DrawerStack';
import RegistrationNavigator from './RegistrationStack';
import SelfTripHome from '../screens/bottomTab/selfTrip/SelfTripHome';
import HomeScreen from '../screens/bottomTab/HomeScreen';
import VacantTrip from '../screens/bottomTab/VacantTrip';
import Bills from '../screens/bottomTab/bills/Bills';

const Stack = createStackNavigator();

const AppStack = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector(getUserDataSelector);

  useEffect(() => {
    getUserDataFromSecureStore();
  }, []);

  const getUserDataFromSecureStore = async () => {
    setIsLoading(true);
    try {
      let token = await SecureStore.getItemAsync('userToken');
      let id = await SecureStore.getItemAsync('userId');
      let name = await SecureStore.getItemAsync('userName');
      let email = await SecureStore.getItemAsync('userEmail');
      let roleId = await SecureStore.getItemAsync('userRoleId');
      let mobile = await SecureStore.getItemAsync('userMobile');

      if (token) {
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
    } catch (error) {
      console.error('Error retrieving user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // You might want to show a loading screen here
    return null;
  }

  return (
    <Stack.Navigator>
      {!userData.userToken ? (
        <>
          <Stack.Screen
            name="Auth"
            component={AuthStackNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegistrationNavigator}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Drawer"
            component={DrawerStack}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SelfTripHome"
            component={SelfTripHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VacantTrip"
            component={VacantTrip}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Bills"
            component={Bills}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
