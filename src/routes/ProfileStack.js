
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/drawer/ProfileScreen';
import RingtoneScreen from '../screens/drawer/RingtoneScreen';


const Stack = createStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="Ringtones" component={RingtoneScreen} />
        </Stack.Navigator>
    );
}
export default ProfileStack;