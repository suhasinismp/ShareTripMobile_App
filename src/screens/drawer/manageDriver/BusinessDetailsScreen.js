import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { fieldNames } from '../../../constants/strings/fieldNames';
import { i18n } from '../../../constants/lang';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../../../components/ui/CustomTextInput';
import CustomButton from '../../../components/ui/CustomButton';
import { businessDetailsScheme } from '../../../constants/schema/businessDetailsScheme';
import ImagePickerGrid from '../../../components/ImagePickerGrid';
import CustomText from '../../../components/ui/CustomText';
import { showSnackbar } from '../../../store/slices/snackBarSlice';
import {
  createBusinessDetails,
  fetchBusinessDetailsByUserId,
  updateBusinessDetails,
} from '../../../services/businessDetailService';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import CustomLoader from '../../../components/CustomLoader';
import AppHeader from '../../../components/AppHeader';

const inputFields = [
  {
    id: 1,
    name: fieldNames.BUSINESS_DETAILS_NAME,
    placeholder: i18n.t('BUSINESS_DETAILS_NAME'),
  },
  {
    id: 2,
    name: fieldNames.BUSINESS_DETAILS_ADDRESS,
    placeholder: i18n.t('BUSINESS_DETAILS_ADDRESS'),
  },
  {
    id: 3,
    name: fieldNames.BUSINESS_DETAILS_AREA,
    placeholder: i18n.t('BUSINESS_DETAILS_AREA'),
  },
  {
    id: 4,
    name: fieldNames.BUSINESS_DETAILS_CITY,
    placeholder: i18n.t('BUSINESS_DETAILS_CITY'),
  },
  {
    id: 5,
    name: fieldNames.BUSINESS_DETAILS_STATE,
    placeholder: i18n.t('BUSINESS_DETAILS_STATE'),
  },
];

const BusinessDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;
  const userRoleId = userData.userRoleId;
  const [initialBusinessDetails, setInitialBusinessDetails] = useState(null);


  const [isLoading, setIsLoading] = useState(true);

  const { theme } = useTheme();
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(businessDetailsScheme),
    defaultValues: {
      [fieldNames.BUSINESS_DETAILS_NAME]: '',
      [fieldNames.BUSINESS_DETAILS_ADDRESS]: '',
      [fieldNames.BUSINESS_DETAILS_AREA]: '',
      [fieldNames.BUSINESS_DETAILS_CITY]: '',
      [fieldNames.BUSINESS_DETAILS_STATE]: '',
    },
  });

  const [logo, setLogo] = useState([]);

  useEffect(() => {
    getBusinessDetails();
  }, [userToken, userId]);

  const getBusinessDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetchBusinessDetailsByUserId(userToken, userId);
      console.log('nnn', response)

      if (response.error === false && response?.data?.length > 0) {
        setInitialBusinessDetails(response.data[0]);
      } else {
        setInitialBusinessDetails(null);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to fetch user details',
          type: 'error',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialBusinessDetails) {
      reset({
        [fieldNames.BUSINESS_DETAILS_NAME]:
          initialBusinessDetails.business_name || '',
        [fieldNames.BUSINESS_DETAILS_ADDRESS]:
          initialBusinessDetails.business_address || '',
        [fieldNames.BUSINESS_DETAILS_AREA]: initialBusinessDetails.area || '',
        [fieldNames.BUSINESS_DETAILS_CITY]: initialBusinessDetails.city || '',
        [fieldNames.BUSINESS_DETAILS_STATE]: initialBusinessDetails.state || '',
      });
      if (initialBusinessDetails.business_logo) {
        setLogo([initialBusinessDetails.business_logo]);
      }
    }
  }, [initialBusinessDetails, reset]);

  const onSubmit = async (data) => {
    if (
      !data.businessName &&
      !data.businessAddress &&
      !data.businessArea &&
      !data.businessCity &&
      !data.businessState &&
      logo.length === 0
    ) {
      navigateToNextScreen();
    } else {
      const finalData = {
        business_name: data.businessName,
        business_address: data.businessAddress,
        area: data.businessArea,
        city: data.businessCity,
        state: data.businessState,
        user_id: userId,
      };

      try {
        let response;
        if (initialBusinessDetails) {
          // Update existing business details
          response = await updateBusinessDetails(finalData, userToken, logo);
        } else {
          // Create new business details
          response = await createBusinessDetails(finalData, userToken, logo);
        }

        if (response?.created_at || response?.updated_at) {
          navigateToNextScreen();
        } else {
          throw new Error('Failed to save business details');
        }
      } catch (error) {
        console.error('Error saving business details:', error);
        dispatch(
          showSnackbar({
            visible: true,
            message: 'Failed to save business details',
            type: 'error',
          }),
        );
      }
    }
  };

  const navigateToNextScreen = () => {
    navigation.navigate('Home');
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <>
      <AppHeader
        drawerIcon={true}
        onlineIcon={true}
        muteIcon={true}
        title={'Business Details'}
      />
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {inputFields.map((item) => (
              <CustomTextInput
                key={item.id}
                control={control}
                name={item.name}
                placeholder={item.placeholder}
                secureTextEntry={item.secureTextEntry}
              />
            ))}
            <CustomText
              text={'Upload Business Logo'}
              variant={'activeText'}
              style={{ marginTop: 20 }}
            />
            <ImagePickerGrid
              noOfPhotos={1}
              onImagesPicked={setLogo}
              images={logo}
              fileType="image"
            />
            <View style={styles.buttonContainer}>
              <CustomButton
                title={initialBusinessDetails ? 'Update' : 'Submit'}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </>
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
    marginTop: 22,
    rowGap: 15,
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
});

export default BusinessDetailsScreen;
