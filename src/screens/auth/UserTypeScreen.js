import React, { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { i18n } from '../../constants/lang/index';
import CustomSelect from '../../components/ui/CustomSelect';
import CustomButton from '../../components/ui/CustomButton';
import { useNavigation } from '@react-navigation/native';
import DriverActiveIcon from '../../../assets/svgs/driverActive.svg';
import DriverInActiveIcon from '../../../assets/svgs/driverInActive.svg';
import TravelAgencyActiveIcon from '../../../assets/svgs/travelAgencyActive.svg';
import TravelAgencyInActiveIcon from '../../../assets/svgs/travelAgencyInActive.svg';
import userTypesAndRoleIds from '../../constants/strings/userTypesAndRoleIds';

const UserTypeScreen = () => {
  const navigation = useNavigation();
  const [userType, setUserType] = useState(userTypesAndRoleIds.DRIVER);
  const driverIcon =
    userType === userTypesAndRoleIds.DRIVER ? (
      <DriverActiveIcon style={{ width: 24, height: 24 }} />
    ) : (
      <DriverInActiveIcon style={{ width: 24, height: 24 }} />
    );
  const travelAgencyIcon =
    userType === userTypesAndRoleIds.TRAVEL_AGENCY ? (
      <TravelAgencyActiveIcon style={{ width: 24, height: 24 }} />
    ) : (
      <TravelAgencyInActiveIcon style={{ width: 24, height: 24 }} />
    );
  const [error, setError] = useState('');

  const handleNext = () => {
    if (
      userType === userTypesAndRoleIds.DRIVER ||
      userType === userTypesAndRoleIds.TRAVEL_AGENCY
    ) {
      setError('');
      navigation.navigate('SignUp', {
        userType,
        userRoleId:
          userType === userTypesAndRoleIds.DRIVER
            ? userTypesAndRoleIds.DRIVER_ROLE_ID
            : userTypesAndRoleIds.TRAVEL_AGENCY_ROLE_ID,
      });
    } else {
      setError(i18n.t('USER_TYPE_ERROR'));
    }
  };

  return (
    <View style={styles.container}>
      {/* Center Content */}
      <View style={styles.centerContent}>
        <CustomText text={i18n.t('USER_TYPE_TEXT')} variant="headerTitle" />
        <CustomSelect
          text={i18n.t('USER_TYPE_DRIVER')}
          isSelected={userType === userTypesAndRoleIds.DRIVER}
          onPress={() => {
            setUserType(userTypesAndRoleIds.DRIVER);
            setError('');
          }}
          containerStyle={{ width: '80%' }}
          icon={driverIcon}
        />
        <CustomSelect
          text={i18n.t('USER_TYPE_TRAVEL_AGENCY')}
          isSelected={userType === userTypesAndRoleIds.TRAVEL_AGENCY}
          onPress={() => {
            setUserType('Travel Agency');
            setError('');
          }}
          containerStyle={{ width: '80%' }}
          icon={travelAgencyIcon}
        />

        {/* Error Message */}
        {error ? (
          <CustomText
            text={error}
            variant="captionTextActive"
            style={styles.errorText}
          />
        ) : null}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <CustomButton
          title={i18n.t('SIGNUP_BUTTON')}
          onPress={handleNext}
          style={{ width: '80%' }}
        />

        <View style={styles.captionContainer}>
          <CustomText
            text={i18n.t('SIGN_IN_ALREADY_HAVE_ACCOUNT')}
            variant="captionText"
          />
          <CustomButton
            title={i18n.t('SIGN_IN_TITLE')}
            onPress={() => {
              Keyboard.dismiss();
              navigation.navigate('SignIn');
            }}
            variant="text"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
  },
  bottomSection: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  captionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default UserTypeScreen;
