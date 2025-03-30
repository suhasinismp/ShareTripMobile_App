import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SelfTripHome from '../screens/bottomTab/selfTrip/SelfTripHome';
import PostATripScreen from '../screens/bottomTab/postTrip/PostATripScreen';
import ViewTripSheet from '../screens/bottomTab/postTrip/ViewTripSheet';
import TripBillScreen from '../screens/bottomTab/bills/TripBillScreen';
import TripBillEditScreen from '../screens/bottomTab/bills/TripBillEditScreen';

const Stack = createStackNavigator();

const SelfTripStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="SelfTripHome"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="SelfTripHome" component={SelfTripHome} />
            <Stack.Screen name="ViewTripSheet" component={ViewTripSheet} />
            <Stack.Screen name="PostATrip" component={PostATripScreen} />
            <Stack.Screen name="TripBill" component={TripBillScreen} />
            <Stack.Screen name="TripBillEdit" component={TripBillEditScreen} />
        </Stack.Navigator>
    );
};

export default SelfTripStack;