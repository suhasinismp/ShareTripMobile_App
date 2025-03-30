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
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { verifyPasswordOTP } from '../../services/forgotPasswordService';

import { useTheme } from '../../hooks/useTheme';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import { i18n } from '../../constants/lang';
import { showSnackbar } from '../../store/slices/snackBarSlice';
import AppHeader from '../../components/AppHeader';

const schema = yup.object({
    phoneNumber: yup
        .string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
});

const EnterNumberScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { theme } = useTheme();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            phoneNumber: '',
        },
    });

    const onSubmit = async (data) => {
        
        try {
            const response = await verifyPasswordOTP(data);
            

            if (response?.message === "SMS sent successfully" && response?.data?.Status === "Success") {
                navigation.navigate('OTPVerifyForgotScreen', {
                    phoneNumber: data.phoneNumber,
                    details: response.data.Details,
                    otp: response.data.OTP
                });

                dispatch(showSnackbar({
                    message: 'OTP sent successfully',
                    type: 'success'
                }));
            } else {
                dispatch(showSnackbar({
                    message: response?.message || 'Failed to send OTP. Please try again.',
                    type: 'error'
                }));
            }
        } catch (error) {
            console.error('OTP Error:', error);
            dispatch(showSnackbar({
                message: 'Network error. Please try again.',
                type: 'error'
            }));
        }
    };


    return (
        <View style={styles.container}>
            <AppHeader title="Forgot Password" />
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
                            name="phoneNumber"
                            placeholder="Enter Phone Number"
                            keyboardType="numeric"
                        />
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Send OTP"
                                onPress={handleSubmit(onSubmit)}
                            // onPress={navigation.navigate('OTPVerifyForgotScreen')}
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

export default EnterNumberScreen;
