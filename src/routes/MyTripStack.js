import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyTrips from '../screens/bottomTab/MyTrips';
import ViewTripSheet from '../screens/bottomTab/postTrip/ViewTripSheet';
import PostATripScreen from '../screens/bottomTab/postTrip/PostATripScreen';
import TripBillScreen from '../screens/bottomTab/bills/TripBillScreen';
import TripBillEditScreen from '../screens/bottomTab/bills/TripBillEditScreen';
import ChatScreen from '../screens/chat/ChatScreen';

const Stack = createStackNavigator();

const MyTripsStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="MyTrips"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="MyTrips" component={MyTrips} />
            <Stack.Screen name="ViewMyTripsTripSheet" component={ViewTripSheet} />
            <Stack.Screen name="PostATrip" component={PostATripScreen} />
            <Stack.Screen name="TripBill" component={TripBillScreen} />
            <Stack.Screen name="TripBillEdit" component={TripBillEditScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
    );
};

export default MyTripsStack;