import { StyleSheet } from 'react-native';
import { FONTS } from './fonts';

export const colors = {
  light: {
    inputTextColor: '#000000',
    placeholderTextColor: '#716F6F',
    headerTitleColor: '#0B3D62',
    activeButtonTextColor: '#ffffff',
    captionTextColor: '#5A5A5A',
    activeTextColor: '#005680',
    sectionTitleColor: '#0D0D0D',
  },
  dark: {
    inputTextColor: '#000000',
    placeholderTextColor: '#716F6F',
    headerTitle: '#0B3D62',
    activeButtonTextColor: '#ffffff',
    captionTextColor: '#5A5A5A',
    activeTextColor: '#005680',
    sectionTitleColor: '#0D0D0D',
  },
};

export const createTextStyles = (theme) =>
  StyleSheet.create({
    placeHolderText: {
      fontFamily: FONTS.Medium500,
      fontSize: 16,
      lineHeight: 23,
      color: colors[theme].placeholderTextColor,
    },
    headerTitle: {
      fontFamily: FONTS.Medium500,
      fontSize: 24,
      lineHeight: 30,
      color: colors[theme].headerTitleColor,
    },
    activeButtonText: {
      fontFamily: FONTS.SemiBold600,
      fontSize: 18,
      lineHeight: 23,
      color: colors[theme].activeButtonTextColor,
    },
    captionText: {
      fontFamily: FONTS.Medium500,
      fontSize: 16,
      lineHeight: 24,
      color: colors[theme].captionTextColor,
    },
    captionTextActive: {
      fontFamily: FONTS.Medium500,
      fontSize: 16,
      lineHeight: 24,
      color: colors[theme].activeTextColor,
    },
    activeText: {
      fontFamily: FONTS.SemiBold600,
      fontSize: 16,
      lineHeight: 24,
      color: colors[theme].activeTextColor,
    },
    sectionTitleText: {
      fontFamily: FONTS.Regular400,
      fontSize: 16,
      lineHeight: 24,
      color: colors[theme].sectionTitleColor,
    },
  });

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
