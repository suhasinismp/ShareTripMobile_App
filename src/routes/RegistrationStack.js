import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const RegistrationStack = createStackNavigator();
const RegistrationNavigator = () => {
  return (
    <RegistrationStack.Navigator>
      <RegistrationStack.Screen name="VehicleDetails" component={View} />
      <RegistrationStack.Screen name="BusinessDetails" component={View} />
      <RegistrationStack.Screen
        name="VehicleAndDriverDocuments"
        component={View}
      />
    </RegistrationStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default RegistrationNavigator;
