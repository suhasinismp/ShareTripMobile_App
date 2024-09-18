import React, { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { fieldNames } from '../../constants/strings/fieldNames';
import { i18n } from '../../constants/lang';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import { businessDetailsScheme } from '../../constants/schema/businessDetailsScheme';
import ImagePickerGrid from '../../components/ImagePickerGrid';
import CustomText from '../../components/ui/CustomText';
import { showSnackbar } from '../../store/slices/snackBarSlice';
import {createBusinessDetails} from '../../services/businessDetailService';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';


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
  const dispatch= useDispatch()
  const userData=useSelector(getUserDataSelector)
  const userId=userData.userId
  const userToken=userData.userToken

  
  const { theme } = useTheme();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(businessDetailsScheme),
  });

  const [logo, setLogo] = useState([]);
  const onSubmit = async(data) => {
   
    const  finalData ={
    "business_name":data.businessName,
    "business_address": data.businessAddress,
    "area" :data.businessArea,
    "city":data.businessCity,
    "state":data.businessState,
    "user_id":userId,

  }
   
  const response = await createBusinessDetails(finalData,userToken, logo)
 
  if(response?.status === 200){
    navigation.navigate('VehicleAndDriverDocuments');
  }
   else{
      dispatch(showSnackbar({visible:true, message:'Failed to create business details', type:'error'}))
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
          />
          <View style={styles.buttonContainer}>
            <CustomButton
              title={i18n.t('SKIP')}
              onPress={() => {}}
              variant="text"
            />

            <CustomButton
              title={i18n.t('SIGNUP_BUTTON')}
              onPress={handleSubmit(onSubmit)}
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
    padding: 20,
  },
  innerContainer: {
    marginTop: 22,
    rowGap: 15,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default BusinessDetailsScreen;
