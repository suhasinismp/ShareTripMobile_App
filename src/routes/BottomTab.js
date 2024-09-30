

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Home from '../../assets/svgs/Home.svg';
import MyTrip from '../../assets/svgs/MyTrips.svg';
import SelfTrip from '../../assets/svgs/SelfTrip.svg';
import Vacant from '../../assets/svgs/VacantTrip.svg';
import Bill from '../../assets/svgs/Bills.svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { useNavigation, useIsFocused } from '@react-navigation/native';



const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ onPress, children }) => {
  return (
    <TouchableOpacity
      style={{
        top: -30,
        justifyContent: "center",
        alignItems: "center",
        ...styles.shadow,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 40,
        //   backgroundColor: "#113F67",
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

const Tabs = () => {
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const navigation = useNavigation();
  // const isFocused = useIsFocused();

  // const toggleModal = () => {
  //   setIsModalVisible(!isModalVisible);
  // };

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName='BottomHome'>
      <Tab.Screen
        name="My Trips"
        component={MyTrip}
        options={{
            // tabBarBadge:2,
          tabBarIcon: ({ focused }) => (
            <View>
              <MyTrip />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Self Trip"
        component={SelfTrip}
        options={{
            // tabBarBadge:12,
          tabBarIcon: ({ focused }) => (
            <View>
              <SelfTrip />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="BottomHome"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Home/>
            </View>
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Vacant Trip"
        component={Vacant}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Vacant />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Bills"
        component={Bill}
        options={{
            // tabBarBadge:9, 
           
          tabBarIcon: ({ focused }) => (
            <View>
              <Bill />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Tabs;
