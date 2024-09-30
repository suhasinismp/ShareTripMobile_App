import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VehicleDocumentScreen from '../screens/drawer/manageVehicle/VehicleDocumentScreen';
import VehicleDetailsScreen from '../screens/drawer/manageVehicle/VehicleDetailsScreen';

const Stack = createStackNavigator();
const VehicleStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="VehicleDetails"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="VehicleDetails"
        component={VehicleDetailsScreen}
        options={{ title: 'Vehicle Details' }}
      />
      <Stack.Screen name="VehicleDocs" component={VehicleDocumentScreen} />
    </Stack.Navigator>
  );
};

export default VehicleStack;
