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

const AppHeader = ({ title, backIcon, rightIcon, onRightIconPress }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.leftContainer}>
        {backIcon && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.centerContainer}>
        <CustomText text={title} variant="headerTitle" />
      </View>
      <View style={styles.rightContainer}>
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
    elevation: 5,
  },

  leftContainer: {
    alignSelf: 'flex-start',
  },
  centerContainer: {
    alignSelf: 'center',
  },
  rightContainer: {
    alignSelf: 'flex-end',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default AppHeader;
