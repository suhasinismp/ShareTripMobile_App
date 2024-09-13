import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomText from './ui/CustomText';
import BackIcon from '../../assets/svgs/back.svg';

const AppHeader = ({ title, backIcon, rightIcon, onRightIconPress }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        {backIcon && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <CustomText text={title} variant="headerTitle" />
      </View>
      <View>
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: '#F3F5FD',
    justifyContent: 'space-between',
    elevation: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // leftContainer: {
  //   alignSelf: 'flex-start',
  // },
  // centerContainer: {
  //   alignSelf: 'center',
  // },
  // rightContainer: {
  //   alignSelf: 'flex-end',
  // },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default AppHeader;
