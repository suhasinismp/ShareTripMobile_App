import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SignUpScreen from '../screens/auth/SignUpScreen';
import AppHeader from '../components/AppHeader';
import SignInScreen from '../screens/auth/SignInScreen';
import { i18n } from '../constants/lang';
import UserTypeScreen from '../screens/auth/UserTypeScreen';
import OTPVerifyScreen from '../screens/auth/OTPVerifyScreen';

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
        name="UserType"
        component={UserTypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: i18n.t('SIGNUP_TITLE') }}
      />
      <Stack.Screen
        name="OTPVerify"
        component={OTPVerifyScreen}
        options={{ title: i18n.t('OTP_VERIFY_TITLE') }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
