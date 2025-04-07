import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { Linking } from 'react-native';
import YoutubeIcon from '../../../assets/svgs/youTubeIcon.svg';
// Import your SVG icons
import NewBookingIcon from '../../../assets/svgs/newBooking.svg';
import AppHeader from '../../components/AppHeader';
import ReceivedTripsIcon from '../../../assets/svgs/receivedTrips.svg';
import PostedTripsIcon from '../../../assets/svgs/postedTrips.svg';
import OwnTripsIcon from '../../../assets/svgs/ownTrips.svg';
import CreateTripIcon from '../../../assets/svgs/fabPlusButton.svg';
import VacantTripsIcon from '../../../assets/svgs/vacantTripss.svg';
import GroupsIcon from '../../../assets/svgs/group.svg';
import EnquiryIcon from '../../../assets/svgs/enquiry.svg';
import TripSheetBillsIcon from '../../../assets/svgs/tripSheetBills.svg';
import EarningsIcon from '../../../assets/svgs/earnings.svg';
import { getProfileByUserId } from '../../services/profileScreenService';

const NewHomeScreen = () => {
    const [userSingleData, setUserSingleData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();
    const userData = useSelector(getUserDataSelector);
    const userToken = userData?.userToken;
    const userId = userData?.userId;
    const [userProfile, setUserProfile] = useState(null);





    // const menuItems = [
    //     { id: 1, title: 'New Booking', icon: NewBookingIcon, route: 'NewBooking' },
    //     { id: 2, title: 'Received Trips', icon: ReceivedTripsIcon, route: 'ReceivedTrips' },
    //     { id: 3, title: 'Posted Trips', icon: PostedTripsIcon, route: 'PostedTrips' },
    //     { id: 4, title: 'Own Trips', icon: OwnTripsIcon, route: 'OwnTrips' },
    //     { id: 5, title: 'Create Trip', icon: CreateTripIcon, route: 'CreateTrip' },
    //     { id: 6, title: 'Vacant Trips', icon: VacantTripsIcon, route: 'VacantTrips' },
    //     { id: 7, title: 'Groups', icon: GroupsIcon, route: 'Groups' },
    //     { id: 8, title: 'Enquiry', icon: EnquiryIcon, route: 'Enquiry' },
    //     { id: 9, title: 'Trip Sheet/Bills', icon: TripSheetBillsIcon, route: 'TripSheetBills' },
    //     { id: 10, title: 'Earnings', icon: EarningsIcon, route: 'Earnings' },
    // ];
    const tripMenuItems = [
        { id: 1, title: 'New Booking', icon: NewBookingIcon, route: 'Home' },
        {
            id: 2, title: 'Received Trips', icon: ReceivedTripsIcon, route: 'MyTrips',
            params: {
                view: 'receivedTrips',
                filterOne: 'Confirmed',
                filterTwo: 'MyDuties',
                tripType: 'Local',
            }
        },
        {
            id: 3,
            title: 'Posted Trips',
            icon: PostedTripsIcon,
            route: 'MyTrips',
            params: {
                view: 'postedTrips',
                filterOne: 'InProgress',
                filterTwo: 'PostedTrips'
            }
        },
        { id: 4, title: 'Own Booking', icon: OwnTripsIcon, route: 'SelfTripHome' },
        {
            id: 5, title: 'Create/Post Trip', icon: CreateTripIcon, route: 'PostTrip', params: {
                from: undefined,
                postId: undefined
            }
        },
    ];

    const otherMenuItems = [
        { id: 6, title: 'Vacant/Enquiry', icon: VacantTripsIcon, route: 'VacantTrip' },
        { id: 7, title: 'Groups', icon: GroupsIcon, route: 'Group' },
        {
            id: 8, title: 'Trip Dairy', icon: EnquiryIcon, route: 'MyTrips',
            params: {
                view: 'enquiry',
                // filterOne: 'Enquiry',
                filterTwo: 'Enquiry'
            }
        },

    ];

    const otherItems = [
        { id: 9, title: 'Trip Sheet/Bills', icon: TripSheetBillsIcon, route: 'Bills' },
        { id: 10, title: 'Earnings', icon: EarningsIcon, route: 'Earnings' },
    ]
    const getUserDetails = async () => {
        setIsLoading(true);
        try {
            const response = await getProfileByUserId(userToken, userId);

            if (response.error === false && response.data) {
                const data = response?.data;
                setUserSingleData(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (userToken && userId) {
            getUserDetails();
        }
    }, [userToken, userId]);

    const renderMenuItems = (items) => {
        return items.map((item) => (
            <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => {
                    if (item.route === 'MyTrips') {
                        navigation.navigate('MyTrips', {
                            screen: 'MyTrips',
                            params: item.params
                        });
                    } else {
                        navigation.navigate(item.route, item.params);
                    }
                }}
            >
                <item.icon width={40} height={40} />
                <Text style={styles.menuItemText}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        ));
    };
    return (
        <View style={styles.container}>
            <AppHeader
                drawerIcon={true}
            />
            {/* Profile Section */}
            <Text
                style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginBottom: 10,
                }}
            >
                Share Trip
            </Text>
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: userProfile ? userProfile.uri : userSingleData?.u_profile_pic }}

                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.userName}>{userData?.userName || 'User Name'}</Text>
                    <Text style={styles.phoneNumber}>{userData?.userMobile || '+91 XXXXXXXXXX'}</Text>
                </View>
                <TouchableOpacity style={styles.profileButton} onPress={() =>
                    navigation.navigate('Profile', { screen: 'RingtoneScreen' })
                }>
                    <Text style={styles.profileButtonText}>My Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Menu Grid */}
            {/* <View style={styles.menuGrid}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.route)}
                    >
                        <item.icon width={24} height={24} />
                        <Text style={styles.menuItemText}>{item.title}</Text>
                    </TouchableOpacity>

                ))}

            </View> */}

            <View>
                {/* <Text style={styles.sectionTitle}>Trip Management</Text> */}
                <View style={styles.menuGrid}>
                    {renderMenuItems(tripMenuItems)}
                </View>
            </View>

            {/* Other Menu Section */}
            <View style={styles.divider} />
            <View >
                <View>
                    {/* <Text style={styles.sectionTitle}>Other Services</Text> */}
                    <View style={styles.menuGrid}>
                        {renderMenuItems(otherMenuItems)}
                    </View>
                </View>
            </View>
            <View style={styles.divider} />
            <View >
                <View>
                    {/* <Text style={styles.sectionTitle}>Other Services</Text> */}
                    <View style={styles.menuGrid}>
                        {renderMenuItems(otherItems)}
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.youtubeSection}
                onPress={() => Linking.openURL('https://www.youtube.com')}
            >

                <YoutubeIcon width={60} height={60} />
                <View style={styles.youtubeTextContainer}>
                    <Text style={styles.youtubeTitle}>Click Here To Watch</Text>
                    <Text style={styles.youtubeSubtitle}>SHARE TRIP</Text>
                    <Text style={styles.youtubeDescription}>Training Video on YouTube</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F5FD',
        padding: 16,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    phoneNumber: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
    },
    profileButton: {
        backgroundColor: '#005680',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    profileButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderRadius: 8,
    },
    menuItem: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItemText: {
        fontSize: 12,
        color: '#000000',
        marginTop: 8,
        textAlign: 'center',
    },
    youtubeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        marginTop: 'auto',  // Changed from '10' to 'auto'
        marginBottom: 16,
        shadowColor: '#000',  // Added shadow properties
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'absolute',  // Added position
        bottom: 0,            // Added bottom
        left: 16,            // Added left
        right: 16,           // Added right
    },
    youtubeTextContainer: {
        marginLeft: 70,
        flex: 1,

    },
    youtubeTitle: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
    },
    youtubeSubtitle: {
        fontSize: 16,
        color: '#005680',
        fontWeight: '600',
        marginVertical: 2,
    },
    youtubeDescription: {
        fontSize: 12,
        color: '#666666',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 5,
        marginTop: 5,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 12,
    },
    menuItem: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    divider: {
        height: 0.5,
        backgroundColor: '#424242',
        marginVertical: 16,
        marginHorizontal: 8,
        marginTop: -30,
    },

});

export default NewHomeScreen;