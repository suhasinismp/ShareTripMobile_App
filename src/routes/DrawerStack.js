// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
// } from '@react-navigation/drawer';

// import { useNavigationState } from '@react-navigation/native';
// import * as SecureStore from 'expo-secure-store';
// import React, { useEffect, useState } from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';

// import { getUserDataSelector } from '../store/selectors';

// import BusinessDetailsScreen from '../screens/drawer/manageDriver/BusinessDetailsScreen';
// import DriverDocumentScreen from '../screens/drawer/manageDriver/DriverDocumentScreen';
// import SubscriptionPlansScreen from '../screens/registration/SubscriptionPlansScreen';
// import Tabs from './BottomTab';
// import VehicleStack from './VehicleStack';
// import ProfileStack from './ProfileStack';


// // Import your SVG icons here
// import BusinessIcon from '../../assets/svgs/business.svg';
// import DashboardIcon from '../../assets/svgs/dasboardIcon.svg';
// import DashboardInactive from '../../assets/svgs/dashboardInactive.svg';
// import DriverDocsIcon from '../../assets/svgs/driverDocs.svg';
// import HelpIcon from '../../assets/svgs/help.svg';
// import LogoutIcon from '../../assets/svgs/logout.svg';
// import ManageBusinessInactive from '../../assets/svgs/manageBusinessInactive.svg';
// import ManageDriverDocumentsInactive from '../../assets/svgs/manageDriverDocumentsInactive.svg';
// import ManageSubscriptionInactive from '../../assets/svgs/manageSubscriptionInactive.svg';
// import HistoryActiveIcon from '../../assets/svgs/historyActive.svg';
// import HistoryInactiveIcon from '../../assets/svgs/historyInActive.svg';
// import ManageVehicleInactive from '../../assets/svgs/manageVehicleInactive.svg';
// import ProfileIcon from '../../assets/svgs/profile.svg';
// import ProfileIconInactive from '../../assets/svgs/profileIconInactive.svg';
// import SubscriptionIcon from '../../assets/svgs/subscription.svg';
// import VehicleIcon from '../../assets/svgs/vehicle.svg';
// import MyTripsActive from '../../assets/svgs/myTripsActive.svg';
// import Vacant from '../../assets/svgs/vacantTrip.svg';
// import SelfTrip from '../../assets/svgs/selfTrip.svg';
// import Bill from '../../assets/svgs/bills.svg';
// import MyTripInactive from '../../assets/svgs/myTripsInactive.svg';
// import SelfTripInactive from '../../assets/svgs/selfTripInactive.svg';
// import VacantTripInactive from '../../assets/svgs/vacantTripInactive.svg';
// import BillsInactive from '../../assets/svgs/billsInactive.svg';
// import Group from '../../assets/svgs/group.svg';

// import PostATripScreen from '../screens/bottomTab/postTrip/PostATripScreen';
// import SelectContactScreen from '../screens/bottomTab/postTrip/SelectContactScreen';
// import SelectGroupScreen from '../screens/bottomTab/postTrip/SelectGroupScreen';
// import CreateSelfTrip from '../screens/bottomTab/selfTrip/CreateSelfTripScreen';

// import { resetStore } from '../store/store';
// import GroupStack from './GroupStack';
// import TripBillScreen from '../screens/bottomTab/bills/TripBillScreen';
// import { getProfileByUserId } from '../services/profileScreenService';
// import TripBillEditScreen from '../screens/bottomTab/bills/TripBillEditScreen';
// import ViewTripSheet from '../screens/bottomTab/postTrip/ViewTripSheet';
// // import MyTrips from '../screens/bottomTab/MyTrips';
// import NewHomeScreen from '../screens/bottomTab/NewHomeScreen';
// import MyTripsStack from './myTripStack';
// import BillStack from './BillStack';
// import SelfTripStack from './selfTripStack';


// const Drawer = createDrawerNavigator();

// const IconWrapper = ({ Icon, isFocused }) => {
//   return (
//     <View style={styles.iconWrapper}>
//       <Icon width={24} height={24} />
//     </View>
//   );
// };

// const CustomDrawerItem = ({ label, icon: Icon, onPress, isFocused }) => {
//   return (
//     <TouchableOpacity
//       style={[styles.drawerItem, isFocused && styles.drawerItemFocused]}
//       onPress={onPress}
//     >
//       <IconWrapper Icon={Icon} isFocused={isFocused} />
//       <Text
//         style={[
//           styles.drawerItemLabel,
//           isFocused && styles.drawerItemLabelFocused,
//         ]}
//       >
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const CustomDrawerContent = (props) => {
//   const dispatch = useDispatch();
//   const userData = useSelector(getUserDataSelector);
//   const userId = userData?.userId;
//   const userToken = userData?.userToken;
//   const name = userData.userName;
//   const { navigation } = props;
//   const [profilePic, setProfilePic] = useState('');

//   const currentRoute = useNavigationState((state) => {
//     if (!state) return '';

//     const route = state.routes[state.index];

//     // Handle nested navigation states
//     if (route.state) {
//       const bottomTabState = route.state;
//       const currentBottomTab = bottomTabState.routes[bottomTabState.index];

//       // If there's another level of nesting (for tab screens)
//       if (currentBottomTab.state) {
//         return currentBottomTab.state.routes[currentBottomTab.state.index].name;
//       }

//       // Return the current bottom tab name if no further nesting
//       return currentBottomTab.name;
//     }

//     // Return the main route name if no nesting
//     return route.name;
//   });

//   const isRouteActive = (routeName) => {
//     // Special handling for bottom tab routes
//     if (['My Trips', 'Self Trip', 'Vacant Trip', 'Bills'].includes(routeName)) {
//       return currentRoute === routeName;
//     }

//     // Handle other routes as before
//     return currentRoute === routeName;
//   };

//   const handleLogout = async () => {
//     try {
//       // Clear secure storage
//       await SecureStore.deleteItemAsync('userToken');
//       await SecureStore.deleteItemAsync('userId');
//       await SecureStore.deleteItemAsync('userName');
//       await SecureStore.deleteItemAsync('userEmail');
//       await SecureStore.deleteItemAsync('userRoleId');
//       await SecureStore.deleteItemAsync('userMobile');

//       // Clear Redux store
//       dispatch(resetStore());
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };

//   const getProfilePicByUserId = async () => {
//     const response = await getProfileByUserId(userToken, userId);
//     setProfilePic(response.data);
//   };

//   useEffect(() => {
//     getProfilePicByUserId();
//   }, []);

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.profileSection}>
//         <Image
//           source={{ uri: profilePic?.u_profile_pic }}
//           style={styles.profileImage}
//         />
//         <View style={styles.profileInfo}>
//           <Text style={styles.userName}>{name}</Text>
//         </View>
//       </View>

//       {/* Menu Items */}
//       <View style={styles.menuSection}>
//         <Text style={styles.menuTitle}>MENU</Text>
//         {/* <CustomDrawerItem
//           label="NewHome"
//           icon={isRouteActive('NewHomeScreen')}
//           onPress={() => navigation.navigate('NewHomeScreen')}
//           isFocused={isRouteActive('NewHomeScreen')}
//         /> */}
//         <CustomDrawerItem
//           label="Dashboard"
//           icon={isRouteActive('NewHomeScreen') ? DashboardInactive : DashboardIcon}
//           onPress={() => navigation.navigate('NewHomeScreen')}
//           isFocused={isRouteActive('NewHomeScreen')}
//         />
//         <CustomDrawerItem
//           label="Profile"
//           icon={isRouteActive('Profile') ? ProfileIconInactive : ProfileIcon}
//           onPress={() =>
//             navigation.navigate('Profile', { screen: 'RingtoneScreen' })
//           }
//           isFocused={isRouteActive('Profile')}
//         />
//         <CustomDrawerItem
//           label="Manage Vehicles & Docs"
//           icon={
//             isRouteActive('ManageVehicle') ? ManageVehicleInactive : VehicleIcon
//           }
//           onPress={() => navigation.navigate('ManageVehicle')}
//           isFocused={isRouteActive('ManageVehicle')}
//         />
//         <CustomDrawerItem
//           label="Manage Business"
//           icon={
//             isRouteActive('ManageBusiness')
//               ? ManageBusinessInactive
//               : BusinessIcon
//           }
//           onPress={() => navigation.navigate('ManageBusiness')}
//           isFocused={isRouteActive('ManageBusiness')}
//         />
//         <CustomDrawerItem
//           label="Manage Subscription"
//           icon={
//             isRouteActive('ManageSubscription')
//               ? ManageSubscriptionInactive
//               : SubscriptionIcon
//           }
//           onPress={() => navigation.navigate('ManageSubscription')}
//           isFocused={isRouteActive('ManageSubscription')}
//         />
//         <CustomDrawerItem
//           label="Manage Driver Documents"
//           icon={
//             isRouteActive('ManageDriverDocuments')
//               ? ManageDriverDocumentsInactive
//               : DriverDocsIcon
//           }
//           onPress={() => navigation.navigate('ManageDriverDocuments')}
//           isFocused={isRouteActive('ManageDriverDocuments')}
//         />
//         <CustomDrawerItem
//           label="History"
//           icon={
//             isRouteActive('History') ? HistoryInactiveIcon : HistoryActiveIcon
//           }
//           onPress={() => navigation.navigate('ManageDriverDocuments')}
//           isFocused={isRouteActive('History')}
//         />
//         {/* <View style={{ marginTop: 24 }}>
//           <CustomDrawerItem
//             label="My Trips"
//             icon={isRouteActive('My Trips') ? MyTripInactive : MyTripsActive}
//             onPress={() => navigation.navigate('Home', { screen: 'My Trips' })}
//             isFocused={isRouteActive('My Trips')}
//           />
//           <CustomDrawerItem
//             label="Self Trip"
//             icon={isRouteActive('SelfTrip') ? SelfTripInactive : SelfTrip}
//             onPress={() => navigation.navigate('SelfTrip')}  // Changed from 'Home' to direct 'SelfTrip' navigation
//             isFocused={isRouteActive('SelfTrip')}
//           />
//           <CustomDrawerItem
//             label="Vacant Trip"
//             icon={isRouteActive('Vacant Trip') ? VacantTripInactive : Vacant}
//             onPress={() =>
//               navigation.navigate('Home', { screen: 'Vacant Trip' })
//             }
//             isFocused={isRouteActive('Vacant Trip')}
//           />
//           <CustomDrawerItem
//             label="Bills"
//             icon={isRouteActive('Bills') ? BillsInactive : Bill}
//             onPress={() => navigation.navigate('Bills')}  // Changed from 'Home' to direct 'Bills' navigation
//             isFocused={isRouteActive('Bills')}
//           /> */}

//         {/* <customDrawerItem
//             label="Groups"
//             icon={isRouteActive('GroupScreen')}
//             onPress={() => navigation.navigate('Home', { screen: 'GroupScreen' })}
//             isFocused={isRouteActive('Groups')}
//           /> */}



//         {/* </View> */}
//       </View>
//       {/* Logout and Help section */}
//       <CustomDrawerItem
//         label="Help"
//         icon={HelpIcon}
//         onPress={() => navigation.navigate('Help')}
//         isFocused={isRouteActive('Help')}
//       />
//       <CustomDrawerItem
//         label="Logout"
//         icon={LogoutIcon}
//         onPress={handleLogout}
//         isFocused={isRouteActive('Logout')} s
//       />
//     </DrawerContentScrollView>
//   );
// };

// const DrawerStack = () => {
//   return (
//     <Drawer.Navigator
//       // initialRouteName="NewHomeScreen" // Set the initial screen here
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: {
//           backgroundColor: '#F8F9FD',
//           width: 280,
//         },
//       }}
//     >
//       <Drawer.Screen name="NewHomeScreen" component={NewHomeScreen} />
//       <Drawer.Screen name="Home" component={Tabs} />
//       <Drawer.Screen name="Profile" component={ProfileStack} />
//       <Drawer.Screen name="ManageVehicle" component={VehicleStack} />
//       <Drawer.Screen name="ManageBusiness" component={BusinessDetailsScreen} />
//       <Drawer.Screen name="ManageSubscription" component={SubscriptionPlansScreen} />
//       <Drawer.Screen name="ManageDriverDocuments"
//         component={DriverDocumentScreen}
//       />
//       <Drawer.Screen name="MyTrips" component={MyTripsStack} />
//       <Drawer.Screen name="Group" component={GroupStack} />
//       {/* <Drawer.Screen name="PostedTrips" component={PostedTrips} /> */}
//       <Drawer.Screen name="PostTrip" component={PostATripScreen} />
//       <Drawer.Screen name="SelectGroups" component={SelectGroupScreen} />
//       <Drawer.Screen name="SelectContacts" component={SelectContactScreen} />
//       <Drawer.Screen name="CreateSelfTrip" component={CreateSelfTrip} />
//       <Drawer.Screen name="TripBill" component={TripBillScreen} />
//       <Drawer.Screen name="TripBillEdit" component={TripBillEditScreen} />
//       <Drawer.Screen name="ViewTripSheet" component={ViewTripSheet} />
//       <Drawer.Screen name="Bills" component={BillStack} />
//       <Drawer.Screen name="SelfTrip" component={SelfTripStack} />

//       <Drawer.Screen
//         name="MyTripsStack"
//         component={MyTripsStack}
//         options={{
//           drawerLabel: 'My Trips',
//           drawerIcon: ({ focused }) => (
//             <IconWrapper
//               Icon={focused ? MyTripsActive : MyTripInactive}
//               isFocused={focused}
//             />
//           ),
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomColor: '#E0E0E0',
//     borderBottomWidth: 1,
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   profileInfo: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   menuSection: {
//     paddingVertical: 20,
//   },
//   menuTitle: {
//     fontSize: 14,
//     color: '#999',
//     marginLeft: 20,
//     marginBottom: 10,
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: 'transparent',
//     marginHorizontal: 10,
//     borderRadius: 8,
//   },
//   drawerItemFocused: {
//     backgroundColor: '#005680',
//   },
//   drawerItemLabel: {
//     marginLeft: 32,
//     fontSize: 16,
//     color: '#000000',
//   },
//   drawerItemLabelFocused: {
//     color: '#FFFFFF',
//   },
//   iconWrapper: {
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default DrawerStack;


import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import { useNavigationState } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { getUserDataSelector } from '../store/selectors';

import BusinessDetailsScreen from '../screens/drawer/manageDriver/BusinessDetailsScreen';
import DriverDocumentScreen from '../screens/drawer/manageDriver/DriverDocumentScreen';
import SubscriptionPlansScreen from '../screens/registration/SubscriptionPlansScreen';
import Tabs from './BottomTab';
import VehicleStack from './VehicleStack';
import ProfileStack from './ProfileStack';


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
import HistoryActiveIcon from '../../assets/svgs/historyActive.svg';
import HistoryInactiveIcon from '../../assets/svgs/historyInActive.svg';
import ManageVehicleInactive from '../../assets/svgs/manageVehicleInactive.svg';
import ProfileIcon from '../../assets/svgs/profile.svg';
import ProfileIconInactive from '../../assets/svgs/profileIconInactive.svg';
import SubscriptionIcon from '../../assets/svgs/subscription.svg';
import VehicleIcon from '../../assets/svgs/vehicle.svg';
import MyTripsActive from '../../assets/svgs/myTripsActive.svg';
import Vacant from '../../assets/svgs/vacantTrip.svg';
import SelfTrip from '../../assets/svgs/selfTrip.svg';
import Bill from '../../assets/svgs/bills.svg';
import MyTripInactive from '../../assets/svgs/myTripsInactive.svg';
import SelfTripInactive from '../../assets/svgs/selfTripInactive.svg';
import VacantTripInactive from '../../assets/svgs/vacantTripInactive.svg';
import BillsInactive from '../../assets/svgs/billsInactive.svg';
import Group from '../../assets/svgs/group.svg';
import NewBookingIcon from '../../assets/svgs/newBooking.svg';
import EarningsIcon from '../../assets/svgs/earnings.svg';
import CreateTripIcon from '../../assets/svgs/fabPlusButton.svg';
import EnquiryIcon from '../../assets/svgs/enquiry.svg';


import PostATripScreen from '../screens/bottomTab/postTrip/PostATripScreen';
import SelectContactScreen from '../screens/bottomTab/postTrip/SelectContactScreen';
import SelectGroupScreen from '../screens/bottomTab/postTrip/SelectGroupScreen';
import CreateSelfTrip from '../screens/bottomTab/selfTrip/CreateSelfTripScreen';

import { resetStore } from '../store/store';
import GroupStack from './GroupStack';
import TripBillScreen from '../screens/bottomTab/bills/TripBillScreen';
import { getProfileByUserId } from '../services/profileScreenService';
import TripBillEditScreen from '../screens/bottomTab/bills/TripBillEditScreen';
import ViewTripSheet from '../screens/bottomTab/postTrip/ViewTripSheet';
import MyTrips from '../screens/bottomTab/MyTrips';
import NewHomeScreen from '../screens/bottomTab/NewHomeScreen';
import MyTripsStack from './MyTripStack';
import BillStack from './BillStack';
import HomeScreen from '../screens/bottomTab/HomeScreen';
import VacantTrip from '../screens/bottomTab/VacantTrip';
import SelfTripHome from '../screens/bottomTab/selfTrip/SelfTripHome';

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
  const userId = userData?.userId;
  const userToken = userData?.userToken;
  const name = userData.userName;
  const { navigation } = props;
  const [profilePic, setProfilePic] = useState('');

  const currentRoute = useNavigationState((state) => {
    if (!state) return '';

    const route = state.routes[state.index];

    // Handle nested navigation states
    if (route.state) {
      const bottomTabState = route.state;
      const currentBottomTab = bottomTabState.routes[bottomTabState.index];

      // If there's another level of nesting (for tab screens)
      if (currentBottomTab.state) {
        return currentBottomTab.state.routes[currentBottomTab.state.index].name;
      }

      // Return the current bottom tab name if no further nesting
      return currentBottomTab.name;
    }

    // Return the main route name if no nesting
    return route.name;
  });

  const isRouteActive = (routeName) => {
    // Special handling for bottom tab routes
    if (['My Trips', 'Self Trip', 'Vacant Trip', 'Bills'].includes(routeName)) {
      return currentRoute === routeName;
    }

    // Handle other routes as before
    return currentRoute === routeName;
  };

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

  const getProfilePicByUserId = async () => {
    const response = await getProfileByUserId(userToken, userId);
    setProfilePic(response.data);
  };

  useEffect(() => {
    getProfilePicByUserId();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: profilePic?.u_profile_pic }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{name}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>MENU</Text>
        {/* <CustomDrawerItem
          label="NewHome"
          icon={isRouteActive('NewHomeScreen')}
          onPress={() => navigation.navigate('NewHomeScreen')}
          isFocused={isRouteActive('NewHomeScreen')}
        /> */}
        <CustomDrawerItem
          label="Dashboard"
          icon={isRouteActive('NewHomeScreen') ? DashboardInactive : DashboardIcon}
          onPress={() => navigation.navigate('NewHomeScreen')}
          isFocused={isRouteActive('NewHomeScreen')}
        />
        <CustomDrawerItem
          label="Profile"
          icon={isRouteActive('Profile') ? ProfileIconInactive : ProfileIcon}
          onPress={() =>
            navigation.navigate('Profile', { screen: 'RingtoneScreen' })
          }
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
        <CustomDrawerItem
          label="History"
          icon={
            isRouteActive('History') ? HistoryInactiveIcon : HistoryActiveIcon
          }
          onPress={() => navigation.navigate('ManageDriverDocuments')}
          isFocused={isRouteActive('History')}
        />
        <View style={{ marginTop: 24 }}>
          <CustomDrawerItem
            label="New Booking"
            icon={isRouteActive('HomeScreen') ? NewBookingIcon : NewBookingIcon}
            onPress={() => navigation.navigate('HomeScreen', {
              screen: 'HomeScreen',
              params: {
                view: 'newBooking',
                filterOne: 'Available',
                filterTwo: 'NewBooking'
              }
            })}
            isFocused={isRouteActive('HomeScreen')}
          />

          <CustomDrawerItem
            label="Posted Trips"
            icon={isRouteActive('My Trips') ? MyTripInactive : MyTripsActive}
            onPress={() => navigation.navigate('MyTrips', {
              screen: 'MyTrips',
              params: {
                view: 'postedTrips',
                filterOne: 'InProgress',
                filterTwo: 'PostedTrips'
              }
            })}
            isFocused={isRouteActive('My Trips')}
          />
          <CustomDrawerItem
            label="Received Trips"
            icon={isRouteActive('My Trips') ? MyTripInactive : MyTripsActive}
            onPress={() => navigation.navigate('MyTrips', {
              screen: 'MyTrips',
              params: {
                view: 'receivedTrips',
                filterOne: 'Confirmed',
                filterTwo: 'MyDuties',
                tripType: 'Local'
              }
            })}
            isFocused={isRouteActive('My Trips')}
          />
          <CustomDrawerItem
            label="Create Trip"
            icon={isRouteActive('CreateTripScreen') ? CreateTripIcon : CreateTripIcon}
            onPress={() => navigation.navigate('PostTrip')}
            isFocused={isRouteActive('PostTrip')}
          />
          <CustomDrawerItem
            label="Own Booking"
            icon={isRouteActive('Self Trip') ? SelfTripInactive : SelfTrip}
            onPress={() => navigation.navigate('SelfTripHome')}
            isFocused={isRouteActive('Self Trip')}
          />
          <CustomDrawerItem
            label="Vacant/Enquiry"
            icon={isRouteActive('Vacant Trip') ? VacantTripInactive : Vacant}
            onPress={() =>
              navigation.navigate('VacantTrip')}

            isFocused={isRouteActive('Vacant Trip')}
          />

          <CustomDrawerItem
            label="Trip Sheet/Bills"
            icon={isRouteActive('Bills') ? BillsInactive : Bill}
            onPress={() => navigation.navigate('Bills')}
            isFocused={isRouteActive('Bills')}
          />
          <CustomDrawerItem
            label="Groups"
            icon={Group}
            onPress={() => navigation.navigate('Groups')}
            isFocused={isRouteActive('Groups')}
          />
          <CustomDrawerItem
            label="Enquiry"
            icon={isRouteActive('EnquiryScreen') ? EnquiryIcon : EnquiryIcon}
            onPress={() => navigation.navigate('MyTrips', {
              screen: 'MyTrips',
              params: {
                view: 'enquiry',
                filterTwo: 'Enquiry'
              }
            })}
            isFocused={isRouteActive('MyTrips')}
          />
          <CustomDrawerItem
            label="Earnings"
            icon={isRouteActive('EarningsScreen') ? EarningsIcon : EarningsIcon}
            // onPress={() => navigation.navigate('HomeScreen', {
            //   screen: 'HomeScreen',
            //   params: {
            //     view: 'earnings',
            //     filterOne: 'Available',
            //     filterTwo: 'Earnings'
            //   }
            // })}
            isFocused={isRouteActive('EarningsScreen')}
          />


        </View>
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
        isFocused={isRouteActive('Logout')} s
      />
    </DrawerContentScrollView>
  );
};

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      // initialRouteName="NewHomeScreen" // Set the initial screen here
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#F8F9FD',
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="NewHomeScreen" component={NewHomeScreen} />
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      {/* <Drawer.Screen name="Home" component={Tabs} /> */}
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="ManageVehicle" component={VehicleStack} />
      <Drawer.Screen name="ManageBusiness" component={BusinessDetailsScreen} />
      <Drawer.Screen name="ManageSubscription" component={SubscriptionPlansScreen} />
      <Drawer.Screen name="ManageDriverDocuments"
        component={DriverDocumentScreen}
      />
      <Drawer.Screen name="MyTrips" component={MyTripsStack} />
      <Drawer.Screen name="Group" component={GroupStack} />
      <Drawer.Screen name="Bills" component={BillStack} />
      <Drawer.Screen name="VacantTrip" component={VacantTrip} />
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="SelfTripHome" component={SelfTripHome} />
      {/* <Drawer.Screen name="PostedTrips" component={PostedTrips} /> */}
      <Drawer.Screen name="PostTrip" component={PostATripScreen} />
      <Drawer.Screen name="SelectGroups" component={SelectGroupScreen} />
      <Drawer.Screen name="SelectContacts" component={SelectContactScreen} />
      <Drawer.Screen name="CreateSelfTrip" component={CreateSelfTrip} />
      <Drawer.Screen name="TripBill" component={TripBillScreen} />
      <Drawer.Screen name="TripBillEdit" component={TripBillEditScreen} />
      <Drawer.Screen name="ViewTripSheet" component={ViewTripSheet} />
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
