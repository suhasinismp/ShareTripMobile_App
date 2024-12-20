import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useNavigationState } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { getUserDataSelector } from '../store/selectors';

import ProfileScreen from '../screens/drawer/ProfileScreen';
import BusinessDetailsScreen from '../screens/drawer/manageDriver/BusinessDetailsScreen';
import DriverDocumentScreen from '../screens/drawer/manageDriver/DriverDocumentScreen';
import SubscriptionPlansScreen from '../screens/registration/SubscriptionPlansScreen';
import Tabs from './BottomTab';
import VehicleStack from './VehicleStack';

// Import your SVG icons here
import BusinessIcon from '../../assets/svgs/business.svg';
import DashboardIcon from '../../assets/svgs/dasboardIcon.svg';
import DashboardInactive from '../../assets/svgs/dashboardInactive.svg';
import DriverDocsIcon from '../../assets/svgs/driverDocs.svg';
import HelpIcon from '../../assets/svgs/help.svg';
import LogoutIcon from '../../assets/svgs/logout.svg';
import ManageBusinessInactive from '../../assets/svgs/manageBusinessInactive.svg';
import ManageDriverDocumentsInactive from '../../assets/svgs/manageDriverDocumentsInactive.svg';
import ManageSubscriptionInactive from '../../assets/svgs/manageSubscriptionInactive.svg';
import ManageVehicleInactive from '../../assets/svgs/manageVehicleInactive.svg';
import ProfileIcon from '../../assets/svgs/profile.svg';
import ProfileIconInactive from '../../assets/svgs/profileIconInactive.svg';
import SubscriptionIcon from '../../assets/svgs/subscription.svg';
import VehicleIcon from '../../assets/svgs/vehicle.svg';
import PostATripScreen from '../screens/bottomTab/postTrip/PostATripScreen';
import SelectContactScreen from '../screens/bottomTab/postTrip/SelectContactScreen';
import SelectGroupScreen from '../screens/bottomTab/postTrip/SelectGroupScreen';
import CreateSelfTrip from '../screens/bottomTab/selfTrip/CreateSelfTripScreen';

import { resetStore } from '../store/store';
import GroupStack from './GroupStack';
import TripBillScreen from '../screens/bottomTab/bills/TripBillScreen';
import TripBillEditScreen from '../screens/bottomTab/bills/TripBillEditScreen';

const Drawer = createDrawerNavigator();

const IconWrapper = ({ Icon, isFocused }) => {
  return (
    <View style={styles.iconWrapper}>
      <Icon width={24} height={24} />
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
  const dispatch = useDispatch();
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

  const handleLogout = async () => {
    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userId');
      await SecureStore.deleteItemAsync('userName');
      await SecureStore.deleteItemAsync('userEmail');
      await SecureStore.deleteItemAsync('userRoleId');
      await SecureStore.deleteItemAsync('userMobile');

      // Clear Redux store
      dispatch(resetStore());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Profile section */}
      <View style={styles.profileSection}>
        {/* <Image
          source={{ uri: u_profile_pic }}
          style={styles.profileImage}
        /> */}
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{name}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>MENU</Text>
        <CustomDrawerItem
          label="Dashboard"
          icon={isRouteActive('Home') ? DashboardInactive : DashboardIcon}
          onPress={() => navigation.navigate('Home')}
          isFocused={isRouteActive('Home')}
        />
        <CustomDrawerItem
          label="Profile"
          icon={isRouteActive('Profile') ? ProfileIconInactive : ProfileIcon}
          onPress={() => navigation.navigate('Profile')}
          isFocused={isRouteActive('Profile')}
        />
        <CustomDrawerItem
          label="Manage Vehicles & Docs"
          icon={
            isRouteActive('ManageVehicle') ? ManageVehicleInactive : VehicleIcon
          }
          onPress={() => navigation.navigate('ManageVehicle')}
          isFocused={isRouteActive('ManageVehicle')}
        />
        <CustomDrawerItem
          label="Manage Business"
          icon={
            isRouteActive('ManageBusiness')
              ? ManageBusinessInactive
              : BusinessIcon
          }
          onPress={() => navigation.navigate('ManageBusiness')}
          isFocused={isRouteActive('ManageBusiness')}
        />
        <CustomDrawerItem
          label="Manage Subscription"
          icon={
            isRouteActive('ManageSubscription')
              ? ManageSubscriptionInactive
              : SubscriptionIcon
          }
          onPress={() => navigation.navigate('ManageSubscription')}
          isFocused={isRouteActive('ManageSubscription')}
        />
        <CustomDrawerItem
          label="Manage Driver Documents"
          icon={
            isRouteActive('ManageDriverDocuments')
              ? ManageDriverDocumentsInactive
              : DriverDocsIcon
          }
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
        onPress={handleLogout}
        isFocused={isRouteActive('Logout')}
      />
    </DrawerContentScrollView>
  );
};

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#F8F9FD',
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="Home" component={Tabs} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="ManageVehicle" component={VehicleStack} />
      <Drawer.Screen name="ManageBusiness" component={BusinessDetailsScreen} />
      <Drawer.Screen
        name="ManageSubscription"
        component={SubscriptionPlansScreen}
      />
      <Drawer.Screen
        name="ManageDriverDocuments"
        component={DriverDocumentScreen}
      />
      <Drawer.Screen name="Group" component={GroupStack} />
      <Drawer.Screen name="PostTrip" component={PostATripScreen} />
      <Drawer.Screen name="SelectGroups" component={SelectGroupScreen} />
      <Drawer.Screen name="SelectContacts" component={SelectContactScreen} />
      <Drawer.Screen name="CreateSelfTrip" component={CreateSelfTrip} />
      <Drawer.Screen name="TripBill" component={TripBillScreen} />
      <Drawer.Screen name="TripBillEdit" component={TripBillEditScreen} />
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
