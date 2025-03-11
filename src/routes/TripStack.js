import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SelfTripHome from '../screens/bottomTab/selfTrip/SelfTripHome';
import ViewTripSheet from '../screens/bottomTab/postTrip/ViewTripSheet';
import PostATripScreen from '../screens/bottomTab/postTrip/PostATripScreen';
import MyTrips from '../screens/bottomTab/MyTrips';

const Stack = createStackNavigator();

const TripStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SelfTripHome" component={SelfTripHome} />
            <Stack.Screen name="ViewTripSheet" component={ViewTripSheet} />
            <Stack.Screen name="PostATrip" component={PostATripScreen} />
            <Stack.Screen name="MyTrips" component={MyTrips} />
        </Stack.Navigator>
    );
};

export default TripStack;