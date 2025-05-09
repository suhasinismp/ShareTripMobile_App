import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';

import UploadDocumentsScreen from '../screens/registration/UploadDocumentsScreen';
import SubscriptionPlansScreen from '../screens/registration/SubscriptionPlansScreen';

const RegistrationStack = createStackNavigator();

const CustomHeader = ({ navigation, route, options, back }) => {
  const title = options.headerTitle ?? options.title ?? route.name;

  return (
    <AppHeader
      title={title}
      backIcon={back ? true : false}
      rightIcon={options.headerRight}
      onRightIconPress={options.headerRight?.onPress}
    />
  );
};
const RegistrationNavigator = () => {
  return (
    <RegistrationStack.Navigator
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <RegistrationStack.Screen
        name="SubscriptionPlans"
        component={SubscriptionPlansScreen}
        options={{ title: 'Choose Subscription' }}
      />
    </RegistrationStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default RegistrationNavigator;
