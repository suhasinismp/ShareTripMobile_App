import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Bills from '../screens/bottomTab/bills/Bills';
import ViewTripSheet from '../screens/bottomTab/postTrip/ViewTripSheet';
import TripBillScreen from '../screens/bottomTab/bills/TripBillScreen';
import TripBillEditScreen from '../screens/bottomTab/bills/TripBillEditScreen';

const Stack = createStackNavigator();

const BillStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Bills"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Bills" component={Bills} />
            <Stack.Screen name="ViewBillsTripSheet" component={ViewTripSheet} />
            <Stack.Screen name="TripBill" component={TripBillScreen} />
            <Stack.Screen name="TripBillEdit" component={TripBillEditScreen} />
        </Stack.Navigator>
    );
};

export default BillStack;