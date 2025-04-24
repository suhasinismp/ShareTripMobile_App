// // import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

// // Import your screen components here
// import HomeScreen from '../screens/bottomTab/HomeScreen';
// import MyTrips from '../screens/bottomTab/MyTrips';
// import VacantTrip from '../screens/bottomTab/VacantTrip';




// // Import your custom SVG components
// import Home from '../../assets/svgs/home.svg';
// import MyTripsActive from '../../assets/svgs/myTripsActive.svg'
// import Vacant from '../../assets/svgs/vacantTrip.svg';
// import SelfTrip from '../../assets/svgs/selfTrip.svg';
// import Bill from '../../assets/svgs/bills.svg';
// import MyTripsInactive from '../../assets/svgs/myTripsInactive.svg';
// import SelfTripInactive from '../../assets/svgs/selfTripInactive.svg';
// import VacantTripInactive from '../../assets/svgs/vacantTripInactive.svg';
// import BillsInactive from '../../assets/svgs/billsInactive.svg';
// import SelfTripHome from '../screens/bottomTab/selfTrip/SelfTripHome';
// import Bills from '../screens/bottomTab/bills/Bills';


// const Tab = createBottomTabNavigator();

// const CustomTabBarButton = ({ children, onPress }) => (
//   <TouchableOpacity
//     style={{
//       top: -22,
//       justifyContent: 'center',
//       alignItems: 'center',
//     }}
//     onPress={onPress}
//   >
//     <View
//       style={{
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         backgroundColor: 'white',
//         justifyContent: 'center',
//         alignItems: 'center',
//         // elevation:1,
//       }}
//     >
//       {children}
//     </View>
//   </TouchableOpacity>
// );

// const Tabs = () => {
//   return (
//     // <Tab.Navigator
//     //   screenOptions={{
//     //     headerShown: false,
//     //     tabBarShowLabel: true,
//     //     tabBarStyle: {
//     //       backgroundColor: '#ffffff',
//     //       height: 60,
//     //       ...styles.shadow,
//     //     },
//     //     tabBarLabelStyle: {
//     //       fontSize: 12,
//     //       marginBottom: 5,
//     //     },
//     //   }}
//     //   initialRouteName="BottomHome"
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: true,
//         tabBarStyle: {
//           backgroundColor: '#ffffff',
//           height: 60,
//           ...styles.shadow,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 5,
//         },
//       }}
//       initialRouteName="Home"
//     >
//       {/* <Tab.Screen
//         name="My Trips"
//         component={MyTrips}
//         options={{
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <MyTripsActive width={24} height={24} />
//             ) : (
//               <MyTripsInactive width={24} height={24} />
//             ),
//         }}
//       /> */}

// //       <Tab.Screen
//         name="Self Trip"
//         component={SelfTripHome}
//         options={{
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <SelfTrip width={24} height={24} />
//             ) : (
//               <SelfTripInactive width={24} height={24} />
//             ),
//         }}
//       />
//       {/* <Tab.Screen
//         name="BottomHome"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Home width={30} height={30} fill="#ffffff" />
//           ),
//           tabBarButton: (props) => <CustomTabBarButton {...props} />,
//           tabBarLabel: () => null,
//         }} */}
//       <Tab.Screen
//         name="Home"  // Change this from "BottomHome" to "Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Home width={30} height={30} fill="#ffffff" />
//           ),
//           tabBarButton: (props) => <CustomTabBarButton {...props} />,
//           tabBarLabel: () => null,
//         }}
//       />
//       <Tab.Screen
//         name="Vacant Trip"
//         component={VacantTrip}
//         options={{
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <Vacant width={24} height={24} />
//             ) : (
//               <VacantTripInactive width={24} height={24} />
//             ),
//         }}
//       />
//       <Tab.Screen
//         name="Bills"
//         component={Bills}
//         options={{
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <Bill width={24} height={24} />
//             ) : (
//               <BillsInactive width={24} height={24} />
//             ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   shadow: {
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.5,
//     elevation: 5,
//   },
// });

// export default Tabs;











// // import React from 'react';
// // import { createStackNavigator } from '@react-navigation/stack';

// // // Import your screen components here
// // // import HomeScreen from '../screens/bottomTab/HomeScreen';
// // // import VacantTrip from '../screens/bottomTab/VacantTrip';
// // // import SelfTripHome from '../screens/bottomTab/selfTrip/SelfTripHome';
// // // import Bills from '../screens/bottomTab/bills/Bills';

// // // const Stack = createStackNavigator();

// // // const Tabs = () => {
// // //   return (
// // //     <Stack.Navigator
// // //       screenOptions={{
// // //         headerShown: false
// // //       }}
// // //     >
// // //       <Stack.Screen name="BottomHome" component={HomeScreen} />
// // //       <Stack.Screen name="Self Trip" component={SelfTripHome} />
// // //       <Stack.Screen name="Vacant Trip" component={VacantTrip} />
// // //       <Stack.Screen name="Bills" component={Bills} />
// // //     </Stack.Navigator>
// // //   );
// // // };

// // // export default Tabs;


import React from 'react';  // Uncomment this
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

// Import your screen components here
import HomeScreen from '../screens/bottomTab/HomeScreen';
import MyTrips from '../screens/bottomTab/MyTrips';
import VacantTrip from '../screens/bottomTab/VacantTrip';
import SelfTripHome from '../screens/bottomTab/selfTrip/SelfTripHome';
import Bills from '../screens/bottomTab/bills/Bills';

// Import your custom SVG components
import Home from '../../assets/svgs/home.svg';
import Vacant from '../../assets/svgs/vacantTrip.svg';
import SelfTrip from '../../assets/svgs/selfTrip.svg';
import Bill from '../../assets/svgs/bills.svg';
import SelfTripInactive from '../../assets/svgs/selfTripInactive.svg';
import VacantTripInactive from '../../assets/svgs/vacantTripInactive.svg';
import BillsInactive from '../../assets/svgs/billsInactive.svg';
Home.defaultProps = {
  width: 30,
  height: 30,
  fill: '#ffffff'
};

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -22,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  </TouchableOpacity >
);

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          // backgroundColor: '#ffffff',
          // height: 60,
          // position: 'absolute',
          bottom: 20, // Adjust vertical position
          left: '74%',
          transform: [{ translateX: -100 }], // Centers the tab bar
          width: 0, // Adjust width as needed
          backgroundColor: '#ffffff',
          height: 10,
          borderRadius: 30,
          ...styles.shadow,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
      initialRouteName="BottomHome"
    >
      {/* <Tab.Screen
        name="Self Trip"
        component={SelfTripHome}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SelfTrip width={24} height={24} />
            ) : (
              <SelfTripInactive width={24} height={24} />
            ),
        }}
      /> */}
      <Tab.Screen
        name="BottomHome"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Home width={30} height={30} fill="#ffffff" />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarLabel: () => null,
        }}
      />
      {/* <Tab.Screen
        name="Vacant Trip"
        component={VacantTrip}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Vacant width={24} height={24} />
            ) : (
              <VacantTripInactive width={24} height={24} />
            ),
        }}
      />
      <Tab.Screen
        name="Bills"
        component={Bills}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Bill width={24} height={24} />
            ) : (
              <BillsInactive width={24} height={24} />
            ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Tabs;






