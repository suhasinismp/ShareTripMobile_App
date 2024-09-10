import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import AuthStackNavigator from './AuthStack';
import RegistrationNavigator from './RegistrationStack';

const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default AppStack;
