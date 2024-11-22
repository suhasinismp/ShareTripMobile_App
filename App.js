import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import CustomSnackbar from './src/components/ui/CustomSnackbar';
import { useTheme, useThemeProvider } from './src/hooks/useTheme';
import AppStack from './src/routes/AppStack';
import store from './src/store/store';
import { ThemeContext } from './src/styles/theme';
import { setInterceptors } from './src/utils/apiInterceptorUtil';


SplashScreen.preventAutoHideAsync();
setInterceptors(store)

function ThemeSwitcher() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={styles.switchContainer}>
      <Text style={[styles.switchText, { color: theme.textColor }]}>
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </Text>
      {/* <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
      /> */}
    </View>
  );
}

export default function App() {
  const themeContext = useThemeProvider();

  const [fontsLoaded, fontError] = useFonts({
    Light: require('./assets/fonts/Poppins-Light.ttf'),
    Regular: require('./assets/fonts/Poppins-Regular.ttf'),
    Medium: require('./assets/fonts/Poppins-Medium.ttf'),
    SemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    Bold: require('./assets/fonts/Poppins-Bold.ttf'),
    ExtraBold: require('./assets/fonts/Poppins-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={themeContext}>
        <NavigationContainer>
          <AppStack />
          <CustomSnackbar />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ThemeContext.Provider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    marginRight: 10,
  },
});
