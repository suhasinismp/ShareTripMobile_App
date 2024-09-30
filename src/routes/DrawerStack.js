import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import HambergerMenu from '../../assets/svgs/hambergerMenu.svg'; 
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

const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {
    const userData = useSelector(getUserDataSelector)
    const name =userData.userName
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
          <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
            <HambergerMenu width={24} height={24} style={styles.hamburgerIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>MENU</Text>
        <DrawerItem
          label="Profile"
          icon={() => <ProfileIcon width={24} height={24} />}
          onPress={() => props.navigation.navigate('Profile')}
        />
        <DrawerItem
          label="Manage Vehicles & Docs"
          icon={() => <VehicleIcon width={24} height={24} />}
          onPress={() => props.navigation.navigate('ManageVehicle')}
        />
        <DrawerItem
          label="Manage Business"
          icon={() => <BusinessIcon width={24} height={24} />}
          onPress={() => props.navigation.navigate('ManageBusiness')}
        />
        <DrawerItem
          label="Manage Subscription"
          icon={() => <SubscriptionIcon width={24} height={24} />}
          onPress={() => props.navigation.navigate('ManageSubscription')}
        />
        <DrawerItem
          label="Manage Driver Documents"
          icon={() => <DriverDocsIcon width={24} height={24} fill='red' />}
          onPress={() => props.navigation.navigate('ManageDriverDocuments')}
        />
       
      </View>

      {/* Logout and Help section */}
      <DrawerItem
        label="Help"
        icon={() => <HelpIcon width={24} height={24} fill={'#aaa'} />} // Adjust the icon or add a help icon
        onPress={() => props.navigation.navigate('Help')}
      />
      <DrawerItem
        label="Logout Account"
        labelStyle={styles.logoutLabel}
        icon={() => <LogoutIcon width={24} height={24} fill={'red'} />} // Use a relevant logout icon
        onPress={() => props.navigation.navigate('Logout')}
      />
    </DrawerContentScrollView>
  );
};

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#F8F9FD', // Light blue background as in the image
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Tabs} // This can be your bottom tab navigator
        options={{
          headerShown: false,
        }}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  hamburgerIcon: {
    marginRight: 10, 
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
  logoutLabel: {
    color: 'red',
  },
});

export default DrawerStack;



