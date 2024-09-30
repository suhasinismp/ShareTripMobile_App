import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useNavigationState } from '@react-navigation/native';
import HamburgerMenu from '../../assets/svgs/hambergerMenu.svg';
import ProfileIcon from '../../assets/svgs/profile.svg';
import VehicleIcon from '../../assets/svgs/vehicle.svg';
import BusinessIcon from '../../assets/svgs/business.svg';
import SubscriptionIcon from '../../assets/svgs/subscription.svg';
import DriverDocsIcon from '../../assets/svgs/driverDocs.svg';
import Tabs from './BottomTab';

import HelpIcon from '../../assets/svgs/help.svg';
import LogoutIcon from '../../assets/svgs/logout.svg';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../store/selectors';
import ProfileScreen from '../screens/drawer/ProfileScreen';
import UploadDocumentsScreen from '../screens/registration/UploadDocumentsScreen';
import BusinessDetailsScreen from '../screens/drawer/manageDriver/BusinessDetailsScreen';
import SubscriptionPlansScreen from '../screens/registration/SubscriptionPlansScreen';
import VehicleDetailsScreen from '../screens/drawer/manageVehicle/VehicleDetailsScreen';
import VehicleStack from './VehicleStack';
import DriverDocumentScreen from '../screens/drawer/manageDriver/DriverDocumentScreen';

const Drawer = createDrawerNavigator();

const IconWrapper = ({ Icon, isFocused }) => {
  return (
    <View style={styles.iconWrapper}>
      <Icon width={24} height={24} fill={isFocused ? '#FFFFFF' : '#005680'} />
    </View>
  );
};

const CustomDrawerItem = ({ label, icon: Icon, onPress, isFocused }) => {
  return (
    <TouchableOpacity
      style={[styles.drawerItem, isFocused && styles.drawerItemFocused]}
      onPress={onPress}
    >
      <IconWrapper Icon={Icon} isFocused={isFocused} />
      <Text
        style={[
          styles.drawerItemLabel,
          isFocused && styles.drawerItemLabelFocused,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomDrawerContent = (props) => {
  const userData = useSelector(getUserDataSelector);
  const name = userData.userName;
  const { navigation } = props;

  const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.state
      ? route.state.routes[route.state.index].name
      : route.name;
  });

  const isRouteActive = (routeName) => currentRoute === routeName;

  return (
    <DrawerContentScrollView {...props}>
      {/* Profile section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/svgs/defaultProfilePic.png')}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{name}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>MENU</Text>
        <CustomDrawerItem
          label="Dashboard"
          icon={ProfileIcon}
          onPress={() => navigation.navigate('Home')}
          isFocused={isRouteActive('Home')}
        />
        <CustomDrawerItem
          label="Profile"
          icon={ProfileIcon}
          onPress={() => navigation.navigate('Profile')}
          isFocused={isRouteActive('Profile')}
        />
        <CustomDrawerItem
          label="Manage Vehicles & Docs"
          icon={VehicleIcon}
          onPress={() => navigation.navigate('ManageVehicle')}
          isFocused={isRouteActive('ManageVehicle')}
        />
        <CustomDrawerItem
          label="Manage Business"
          icon={BusinessIcon}
          onPress={() => navigation.navigate('ManageBusiness')}
          isFocused={isRouteActive('ManageBusiness')}
        />
        <CustomDrawerItem
          label="Manage Subscription"
          icon={SubscriptionIcon}
          onPress={() => navigation.navigate('ManageSubscription')}
          isFocused={isRouteActive('ManageSubscription')}
        />
        <CustomDrawerItem
          label="Manage Driver Documents"
          icon={DriverDocsIcon}
          onPress={() => navigation.navigate('ManageDriverDocuments')}
          isFocused={isRouteActive('ManageDriverDocuments')}
        />
      </View>

      {/* Logout and Help section */}
      <CustomDrawerItem
        label="Help"
        icon={HelpIcon}
        onPress={() => navigation.navigate('Help')}
        isFocused={isRouteActive('Help')}
      />
      <CustomDrawerItem
        label="Logout"
        icon={LogoutIcon}
        onPress={() => navigation.navigate('Logout')}
        isFocused={isRouteActive('Logout')}
      />
    </DrawerContentScrollView>
  );
};

// Placeholder components for Help and Logout
const HelpScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Help Screen</Text>
  </View>
);

const LogoutScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Logout Screen</Text>
  </View>
);

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: '#F8F9FD',
          width: 280,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={styles.hamburgerIcon}
          >
            <HamburgerMenu width={24} height={24} />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Home" component={Tabs} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen
        name="ManageVehicle"
        component={VehicleStack}
        options={{ title: 'Vehicle Details' }}
      />
      <Drawer.Screen
        name="ManageBusiness"
        component={BusinessDetailsScreen}
        options={{ title: 'Business Details' }}
      />
      <Drawer.Screen
        name="ManageSubscription"
        component={SubscriptionPlansScreen}
        options={{ title: 'Subscription Plans' }}
      />
      <Drawer.Screen
        name="ManageDriverDocuments"
        component={DriverDocumentScreen}
        options={{ title: 'Driver Documents' }}
      />
      <Drawer.Screen name="Help" component={HelpScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hamburgerIcon: {
    marginLeft: 10,
  },
  menuSection: {
    paddingVertical: 20,
  },
  menuTitle: {
    fontSize: 14,
    color: '#999',
    marginLeft: 20,
    marginBottom: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
    borderRadius: 8,
  },
  drawerItemFocused: {
    backgroundColor: '#005680',
  },
  drawerItemLabel: {
    marginLeft: 32,
    fontSize: 16,
    color: '#000000',
  },
  drawerItemLabelFocused: {
    color: '#FFFFFF',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrawerStack;
