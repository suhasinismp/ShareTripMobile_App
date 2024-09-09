import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SignUpScreen from '../screens/auth/SignUpScreen';
import AppHeader from '../components/AppHeader';
import SignInScreen from '../screens/auth/SignInScreen';

const Stack = createStackNavigator();

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

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: 'Sign Up' }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
