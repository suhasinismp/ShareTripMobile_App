import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GroupsScreen from '../screens/groups/GroupsScreen';
import ViewGroupRequestsScreen from '../screens/groups/ViewGroupRequestsScreen';
import CreateGroupScreen from '../screens/groups/CreateGroupScreen';
import AddGroupMembers from '../screens/groups/AddGroupMembers';

const Stack = createStackNavigator();

const GroupStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Groups"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="GroupRequests" component={ViewGroupRequestsScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="AddGroupMembers" component={AddGroupMembers} />
    </Stack.Navigator>
  );
};

export default GroupStack;
