import React from 'react';
import {
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { useTheme } from '../../hooks/useTheme';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import { showSnackbar } from '../../store/slices/snackBarSlice';
import AppHeader from '../../components/AppHeader';
import { resetPassword } from '../../services/forgotPasswordService';

const schema = yup.object({
    newPassword: yup
        .string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
        .string()
        .required('Confirm password is required')
        .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { phoneNumber, details, otp } = route.params || {};
    // const { phoneNumber, details } = route.params;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });
    // const onSubmit = async (data) => {
    //     try {
    //         // Check if passwords match
    //         if (data.newPassword !== data.confirmPassword) {
    //             dispatch(showSnackbar({
    //                 message: 'Passwords do not match',
    //                 type: 'error',
    //             }));
    //             return;
    //         }

    //         // Send only mobile number and newPassword
    //         const finalData = {
    //             u_mob_num: phoneNumber,
    //             u_pswd: data.newPassword  // Send only the newPassword value
    //         };
    //         console.log('Final Datatt:', finalData);
    //         const response = await resetPassword(finalData);
    //         console.log('Reset Password Response:', response);

    //         // Check if the response contains a success message or any other relevant inf
    //         if (response?.message === "Password reset successfully") {
    //             dispatch(showSnackbar({
    //                 message: 'Password reset successful',
    //                 type: 'success',
    //             }));
    //             navigation.replace('Login');
    //         } else {
    //             dispatch(showSnackbar({
    //                 message: response?.message || 'Failed to reset password',
    //                 type: 'error',
    //             }));
    //         }
    //     } catch (error) {
    //         console.error('Reset Password Error:', error);
    //         dispatch(showSnackbar({
    //             message: 'Something went wrong. Please try again.',
    //             type: 'error',
    //         }));
    //     }
    // };


    const onSubmit = async (data) => {
        try {
            if (!phoneNumber) {
                dispatch(showSnackbar({
                    message: 'Missing phone number. Please try again.',
                    type: 'error',
                }));
                return;
            }

            if (data.newPassword !== data.confirmPassword) {
                dispatch(showSnackbar({
                    message: 'Passwords do not match',
                    type: 'error',
                }));
                return;
            }

            const finalData = {
                u_mob_num: phoneNumber,
                u_pswd: data.newPassword
            };

            console.log('Reset Password Payload:', finalData);
            const response = await resetPassword(finalData);
            console.log('Reset Password Response:', response);

            if (response?.error === false && response?.message?.includes("updated")) {
                dispatch(showSnackbar({
                    message: response.message,
                    type: 'success',
                }));
                navigation.replace('SignIn');
            } else {
                dispatch(showSnackbar({
                    message: response?.message || 'Failed to reset password',
                    type: 'error',
                }));
            }
        } catch (error) {
            console.error('Reset Password Error:', error);
            dispatch(showSnackbar({
                message: 'Something went wrong. Please try again.',
                type: 'error',
            }));
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Reset Password" />
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.contentContainer,
                    { backgroundColor: theme.backgroundColor },
                ]}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <CustomTextInput
                            control={control}
                            name="newPassword"
                            placeholder="Enter New Password"
                            secureTextEntry
                        />
                        <CustomTextInput
                            control={control}
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            secureTextEntry
                        />
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Reset Password"
                                onPress={handleSubmit(onSubmit)}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        padding: 20,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        rowGap: 15,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default ResetPasswordScreen;
