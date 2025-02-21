// import React from 'react';
// import {
//   Keyboard,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';
// import AppLogo from '../../../assets/svgs/shareTripLogo.svg';
// import { fieldNames } from '../../constants/strings/fieldNames';
// import { i18n } from '../../constants/lang';
// import CustomTextInput from '../../components/ui/CustomTextInput';
// import CustomButton from '../../components/ui/CustomButton';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

// import { useTheme } from '../../hooks/useTheme';
// import { signInScheme } from '../../constants/schema/loginScheme';
// import CustomText from '../../components/ui/CustomText';
// import { useNavigation } from '@react-navigation/native';
// import { doLogin } from '../../services/signinService';
// import { useDispatch } from 'react-redux';
// import { showSnackbar } from '../../store/slices/snackBarSlice';
// import { setUserDataToStore } from '../../store/slices/loginSlice';
// import * as SecureStore from 'expo-secure-store';

// const inputFields = [
//   {
//     name: fieldNames.PHONE,
//     placeholder: i18n.t('SIGN_IN_PHONE'),
//     keyboardType: 'numeric',
//   },
//   {
//     name: fieldNames.PASSWORD,
//     placeholder: i18n.t('SIGN_IN_PASSWORD'),
//     secureTextEntry: true,
//   },
// ];

// const SignInScreen = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const { theme } = useTheme();
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(signInScheme),
//     defaultValues: {
//       [fieldNames.PHONE]: '',
//       [fieldNames.PASSWORD]: '',
//     },
//   });

//   const onSignin = async (data) => {
//     const finalData = {
//       u_mob_num: data.Phone,
//       u_pswd: data.password,
//     };

//     const response = await doLogin(finalData);

//     if (response?.token) {
//       await SecureStore.setItemAsync('userToken', response.token);
//       await SecureStore.setItemAsync('userId', response.id.toString());
//       await SecureStore.setItemAsync('userName', response.u_name);
//       await SecureStore.setItemAsync('userEmail', response.u_email_id);
//       await SecureStore.setItemAsync('userRoleId', response.role_id.toString());
//       await SecureStore.setItemAsync('userMobile', response.u_mob_num);
//       await dispatch(
//         setUserDataToStore({
//           userId: response.id,
//           userName: response.u_name,
//           userEmail: response.u_email_id,
//           userRoleId: response.role_id,
//           userMobile: response.u_mob_num,
//           userToken: response.token,
//         }),
//       );
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={[
//         styles.contentContainer,
//         { backgroundColor: theme.backgroundColor },
//       ]}
//       enableOnAndroid={true}
//       enableAutomaticScroll={true}
//       keyboardShouldPersistTaps="handled"
//     >
//       <AppLogo style={{ alignSelf: 'center' }} />

//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.innerContainer}>
//           {inputFields.map((item) => (
//             <CustomTextInput
//               key={item.name}
//               control={control}
//               name={item.name}
//               placeholder={item.placeholder}
//               secureTextEntry={item.secureTextEntry}
//               keyboardType={item.keyboardType}
//             />
//           ))}
//           <View style={styles.buttonContainer}>
//             <CustomButton
//               title={i18n.t('SIGN_IN_BUTTON')}
//               onPress={handleSubmit(onSignin)}
//             />
//           </View>
//           <View style={styles.captionContainer}>
//             <CustomText
//               text={i18n.t('SIGNUP_DONT_HAVE_ACCOUNT')}
//               variant="captionText"
//             />
//             <CustomButton
//               title={i18n.t('SIGNUP_TITLE')}
//               onPress={() => {
//                 Keyboard.dismiss();
//                 navigation.navigate('UserType');
//               }}
//               variant="text"
//             />
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAwareScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   contentContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   innerContainer: {
//     marginTop: 22,
//     rowGap: 15,
//   },
//   buttonContainer: {
//     marginTop: 20,
//   },
//   captionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default SignInScreen;


import React from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AppLogo from '../../../assets/svgs/shareTripLogo.svg';
import { fieldNames } from '../../constants/strings/fieldNames';
import { i18n } from '../../constants/lang';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useTheme } from '../../hooks/useTheme';
import { signInScheme } from '../../constants/schema/loginScheme';
import CustomText from '../../components/ui/CustomText';
import { useNavigation } from '@react-navigation/native';
import { doLogin } from '../../services/signinService';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store/slices/snackBarSlice';
import { setUserDataToStore } from '../../store/slices/loginSlice';
import * as SecureStore from 'expo-secure-store';

const inputFields = [
  {
    name: fieldNames.PHONE,
    placeholder: i18n.t('SIGN_IN_PHONE'),
    keyboardType: 'numeric',
  },
  {
    name: fieldNames.PASSWORD,
    placeholder: i18n.t('SIGN_IN_PASSWORD'),
    secureTextEntry: true,
  },
];

const SignInScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInScheme),
    defaultValues: {
      [fieldNames.PHONE]: '',
      [fieldNames.PASSWORD]: '',
    },
  });

  const onSignin = async (data) => {
    const finalData = {
      u_mob_num: data.Phone,
      u_pswd: data.password,
    };

    const response = await doLogin(finalData);

    if (response?.token) {

      await SecureStore.setItemAsync('userToken', response.token);
      await SecureStore.setItemAsync('userId', response.id.toString());
      await SecureStore.setItemAsync('userName', response.u_name);
      await SecureStore.setItemAsync('userEmail', response.u_email_id);
      await SecureStore.setItemAsync('userRoleId', response.role_id.toString());
      await SecureStore.setItemAsync('userMobile', response.u_mob_num);
      await dispatch(
        setUserDataToStore({
          userId: response.id,
          userName: response.u_name,
          userEmail: response.u_email_id,
          userRoleId: response.role_id,
          userMobile: response.u_mob_num,
          userToken: response.token,
        }),
      );
      navigation.navigate('NewHomePage');
    } else {
      dispatch(showSnackbar({ message: 'Login failed. Please try again.' }));

    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        { backgroundColor: theme.backgroundColor },
      ]}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
    >
      <AppLogo style={{ alignSelf: 'center' }} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {inputFields.map((item) => (
            <CustomTextInput
              key={item.name}
              control={control}
              name={item.name}
              placeholder={item.placeholder}
              secureTextEntry={item.secureTextEntry}
              keyboardType={item.keyboardType}
            />
          ))}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={i18n.t('SIGN_IN_BUTTON')}
              onPress={handleSubmit(onSignin)}
            />
          </View>
          <View style={styles.captionContainer}>
            <CustomText
              text={i18n.t('SIGNUP_DONT_HAVE_ACCOUNT')}
              variant="captionText"
            />
            <CustomButton
              title={i18n.t('SIGNUP_TITLE')}
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate('UserType');
              }}
              variant="text"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    marginTop: 22,
    rowGap: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
  captionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;
