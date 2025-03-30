import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import UserTypeScreen from '../screens/auth/UserTypeScreen';
import OTPVerifyScreen from '../screens/auth/OTPVerifyScreen';
import EnterNumberScreen from '../screens/auth/EnterNumberScreen';
import OTPVerifyForgotScreen from '../screens/auth/OTPVerifyForgotScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';



const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="UserType" component={UserTypeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="EnterNumberScreen" component={EnterNumberScreen} />
      <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
      <Stack.Screen name="OTPVerifyForgotScreen" component={OTPVerifyForgotScreen} />
      {/* <Stack.Screen name="NewHome" component={NewHomeScreen} /> */}
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
