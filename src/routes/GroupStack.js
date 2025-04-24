import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GroupsScreen from '../screens/groups/GroupsScreen';
import ViewGroupRequestsScreen from '../screens/groups/ViewGroupRequestsScreen';
import CreateGroupScreen from '../screens/groups/CreateGroupScreen';
import AddGroupMembers from '../screens/groups/AddGroupMembers';
import GroupDetailScreen from '../screens/groups/GroupDetailScreen';


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
      <Stack.Screen name="GroupDetailScreen" component={GroupDetailScreen} />
    </Stack.Navigator>
  );
};

export default GroupStack;
