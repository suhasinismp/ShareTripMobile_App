



import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CallIcon from '../../assets/svgs/call.svg';
import DotDivider from '../../assets/svgs/dotDivider.svg';
import TripSheetIcon from '../../assets/svgs/tripSheet.svg';
import { FONTS } from '../styles/fonts';
import AudioPlayer from './AudioPlayer';

const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w+/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
};

const PostCard = ({
  // Card Header Props
  bookingType,
  createdAt,
  postStatus,
  showActionButtons,
  // User Info Props
  userProfilePic,
  userName,
  postSharedWith,

  // Trip Details Props
  pickUpTime,
  fromDate,
  vehicleType,
  vehicleName,
  pickUpLocation,
  destination,

  // Comment/Voice Props
  postComments,
  postVoiceMessage,
  numberOfDays,
  // Amount Props
  baseFareRate,
  extrakms,
  booking_type_name,
  // Action Props
  onRequestPress,
  onCallPress,
  onTripSheetPress,
  isRequested,
  packageName,
  vacantTripPostedByLoggedInUser,
  viewTripSheet,
  viewTripSheetOnPress,
  chat,
  onMessagePress,
  driverTripBill,
  driverTripBillOnPress,
  customerBill,
  customerBillOnPress,
  billsScreen,
}) => {


  const requestStatus = isRequested ? isRequested : 'Accept';

  const isAvailable = postStatus === 'Available' || postStatus === 'available';

  const hasCommentOrVoice = postComments || postVoiceMessage;

  const getHeaderColor = () => {
    if (billsScreen) {
      return '#CCE3F4';  // Always use this color for bills screen
    }
    return isAvailable ? '#CCE3F4' : '#FF9C7D';
  };

  // const getStatusColor = () => {
  //   return isAvailable ? '#21833F' : '#D33D0E';
  // };

  const getStatusColor = () => {
    return isAvailable ? '#21833F' : '#D33D0E';
  };

  const getBookingTypeColor = () => {
    return '#21833F'; // Or any color you want for the text
  };
  const getBookingTypeBackgroundColor = () => {
    return '#E8F4FF'; // Or any color you want for the background
  };

  const getStatusBackgroundColor = () => {
    return isAvailable ? '#E8F4FF' : '#FFE8E8';
  };

  const getIconColor = () => {
    return isAvailable ? '#005680' : '#666';
  };

  const getButtonStyle = (buttonText) => {
    switch (buttonText.toLowerCase()) {
      case 'start trip':
        return '#FFD700'; // Yellow color for Start Trip
      case 'end trip':
        return '#FF0000'; // Red color for End Trip
      case 'on duty':
      case 'continue for next day':
        return '#4CAF50'; // Green color for On Duty and Continue buttons
      default:
        return '#005680'; // Default blue color for other buttons
    }
  };
  const getButtonTextStyle = (buttonText) => {
    switch (buttonText.toLowerCase()) {
      case 'start trip':
      case 'on duty':
        return '#000000'; // Black text for Start Trip and On Duty
      default:
        return '#FFFFFF'; // White text for other buttons
    }
  };


  return (
    <View style={styles.card}>
      {/* Card Header */}
      {postStatus && (
        <View
          style={[styles.cardHeader, { backgroundColor: getHeaderColor() }]}
        >
          {bookingType && (
            <View style={[styles.bookingTypeWrapper, { backgroundColor: getBookingTypeBackgroundColor() }]}>
              {/* <Text style={styles.cardType}>{capitalizeWords(bookingType)}</Text> */}
              <Text style={[
                styles.cardType,
                {
                  color: getBookingTypeColor(),
                  backgroundColor: '#FFFFFF',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }
              ]}>
                {capitalizeWords(bookingType)}
              </Text>
            </View>
          )}
          {createdAt && <Text style={styles.cardDate}>{createdAt}</Text>}

          {postStatus && (
            <View style={[styles.statusWrapper, { backgroundColor: getStatusBackgroundColor() }]}>
              <Text style={[
                styles.cardStatus,
                {
                  color: getStatusColor(),
                  backgroundColor: '#FFFFFF',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }
              ]}>
                {capitalizeWords(postStatus)}
              </Text>
            </View>
          )}
        </View>
      )}


      {/* User Info Section */}
      <View style={styles.cardContent}>
        <View style={styles.userInfo}>
          {userProfilePic && (
            <Image source={{ uri: userProfilePic }} style={styles.profilePic} />
          )}
          {userName && (
            <Text style={styles.userName}>{capitalizeWords(userName)}</Text>
          )}
        </View>
        {postSharedWith && (
          <View style={styles.postSharedWithInfo}>
            {postStatus && (
              <Ionicons name="people" size={20} color={getIconColor()} />
            )}
            <Text style={styles.postSharedWith}>
              {postStatus
                ? capitalizeWords(postSharedWith)
                : capitalizeWords(bookingType)}
            </Text>
          </View>
        )}
      </View>

      {isAvailable || (!postStatus && <DotDivider />)}

      {/* Card Body */}
      <View style={styles.cardBody}>
        <View style={styles.mainContent}>
          {/* Trip Info Section */}
          <View style={styles.tripInfo}>
            {!hasCommentOrVoice && (
              <>
                <View style={styles.timeAndDate}>
                  {pickUpTime && (
                    <>
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={getIconColor()}
                      />
                      <Text
                        style={[
                          styles.tripTime,
                          { color: isAvailable ? '#171661' : '#666' },
                        ]}
                      >
                        {pickUpTime || 'N/A'}
                      </Text>
                    </>
                  )}
                  {fromDate && (
                    <Text
                      style={[
                        styles.tripDate,
                        { color: isAvailable ? '#171661' : '#666' },
                      ]}
                    >
                      {fromDate || 'N/A'}
                    </Text>
                  )}
                </View>
                {numberOfDays && (
                  <View style={styles.daysInfo}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={getIconColor()}
                    />
                    <Text
                      style={[
                        styles.tripTime,
                        { color: isAvailable ? '#171661' : '#666' },
                      ]}
                    >
                      {`${numberOfDays} Days`}
                    </Text>
                  </View>
                )}
                <View style={styles.distanceAndVehicle}>
                  <View style={styles.distanceInfo}>
                    {packageName && (
                      <>
                        <Ionicons
                          name="car-outline"
                          size={20}
                          color={getIconColor()}
                        />
                        <Text
                          style={[
                            styles.distanceText,
                            { color: isAvailable ? '#123F67' : '#666' },
                          ]}
                        >
                          {packageName}
                        </Text>
                      </>
                    )}
                  </View>
                  {(vehicleType || vehicleName) && (
                    <View style={styles.vehicleInfo}>
                      <Ionicons name="car" size={20} color={getIconColor()} />
                      <Text
                        style={[
                          styles.vehicleText,
                          { color: isAvailable ? '#171661' : '#666' },
                        ]}
                      >
                        {`${capitalizeWords(vehicleType || 'N/A')}, ${capitalizeWords(vehicleName || 'N/A')}`}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            {hasCommentOrVoice && (
              <>
                <View style={styles.distanceInfo}>
                  {packageName && (
                    <>
                      <Ionicons
                        name="car-outline"
                        size={20}
                        color={getIconColor()}
                      />
                      <Text
                        style={[
                          styles.distanceText,
                          { color: isAvailable ? '#123F67' : '#666', },
                        ]}
                      >
                        {packageName}
                      </Text>
                    </>
                  )}
                </View>
                {(vehicleType || vehicleName) && (
                  <View style={styles.vehicleInfo}>
                    <Ionicons name="car" size={20} color={getIconColor()} />
                    <Text
                      style={[
                        styles.vehicleText,
                        { color: isAvailable ? '#171661' : '#666' },
                      ]}
                    >
                      {`${capitalizeWords(vehicleType || 'N/A')}, ${capitalizeWords(vehicleName || 'N/A')}`}
                    </Text>
                  </View>
                )}
                <View style={styles.commentSection}>
                  <Text style={styles.commentText}>
                    {capitalizeWords(postComments || 'Voice Message Available')}
                  </Text>
                </View>
                <AudioPlayer url={postVoiceMessage} />
              </>
            )}

            {/* Location Info - Only show for available cards without comments */}
            {isAvailable && !hasCommentOrVoice && (
              <>
                {pickUpLocation && (
                  <View style={styles.locationInfo}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#4CAF50"
                    />
                    <Text style={styles.locationText}>
                      {capitalizeWords(pickUpLocation || 'N/A')}
                    </Text>
                  </View>
                )}
                {destination && (
                  <View style={styles.locationInfo}>
                    <Ionicons name="location" size={20} color="#F44336" />
                    <Text style={styles.locationText}>
                      {capitalizeWords(destination || 'N/A')}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Footer Section - Only show for available cards */}
          {isAvailable || !postStatus ? (

            <View style={styles.cardFooter}>
              {baseFareRate && (
                <View style={styles.footerLeft}>
                  {!hasCommentOrVoice && (
                    <View style={styles.amountSection}>
                      <Text style={styles.amountLabel}>Amount:</Text>
                      <Text style={styles.amountText}>
                        {`Rs ${baseFareRate}/${extrakms ? ` ${extrakms}` : ''}/`}
                      </Text>
                    </View>
                  )}
                </View>
              )}


              {!billsScreen && vacantTripPostedByLoggedInUser === undefined && (
                <View style={styles.footerRight}>

                  <TouchableOpacity
                    style={[styles.acceptButton, { backgroundColor: getButtonStyle(requestStatus) }]}
                    onPress={onRequestPress}
                    disabled={isRequested === 'Quoted' ? true : false}
                  >
                    <Text style={[styles.acceptButtonText, { color: getButtonTextStyle(requestStatus) }]}>
                      {requestStatus}
                    </Text>
                  </TouchableOpacity>

                </View>
              )}
              {vacantTripPostedByLoggedInUser === true && (
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={onRequestPress}
                >
                  <Text style={styles.acceptButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>

        {/* Action Buttons - Only show for available cards */}
        {(showActionButtons || isAvailable || vacantTripPostedByLoggedInUser !== undefined) && (
          (onRequestPress || onTripSheetPress) && (
            <View style={styles.actionButtonsContainer}>
              {onCallPress && (<TouchableOpacity onPress={onCallPress}>
                <CallIcon />
              </TouchableOpacity>
              )}
              {onTripSheetPress && (<TouchableOpacity onPress={onTripSheetPress}>
                <TripSheetIcon />
              </TouchableOpacity>
              )}
              {chat && (
                <TouchableOpacity onPress={onMessagePress}>
                  <Ionicons name="chatbox-outline" size={24} color="#000" />
                </TouchableOpacity>
              )}
            </View>
          )
        )}

      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}
      >
        {viewTripSheet && (
          <TouchableOpacity
            onPress={viewTripSheetOnPress}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>View Trip Sheet</Text>
          </TouchableOpacity>
        )}

        {driverTripBill && (
          <TouchableOpacity
            onPress={driverTripBillOnPress}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>Driver Trip Bill</Text>
          </TouchableOpacity>
        )}
        {customerBill && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={customerBillOnPress}
          >
            <Text style={styles.buttonText}>Customer Bill</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  cardType: {
    fontSize: 17,
    fontFamily: FONTS.SemiBold600,
    color: '#123F67',
    lineHeight: 22,
  },
  cardDate: {
    color: '#000000',
    fontSize: 12,
  },
  daysInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardStatus: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold600,
    lineHeight: 23,
    overflow: 'hidden',
  },
  statusWrapper: {
    padding: 4,
    borderRadius: 4,

  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#0D0D0D',
    lineHeight: 27,
  },
  postSharedWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postSharedWith: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 23,
    fontFamily: FONTS.Regular400,
    color: '#000000',
  },
  cardBody: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    padding: 10,
  },
  mainContent: {
    flex: 1,
    marginRight: 10,
  },
  bookingTypeWrapper: {
    padding: 4,
    borderRadius: 4,
  },
  cardType: {
    fontSize: 17,
    fontFamily: FONTS.SemiBold600,
    lineHeight: 22,
  },
  tripInfo: {
    marginBottom: 12,
  },
  timeAndDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripTime: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    lineHeight: 22,
  },
  tripDate: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    lineHeight: 22,
  },
  distanceAndVehicle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FONTS.Bold700,
    color: '#123F67',
    lineHeight: 22,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Bold700,
    lineHeight: 22,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    lineHeight: 25,
    color: '#0F0F0F',
  },
  commentSection: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  commentText: {
    color: '#666',
  },
  amountText: {
    fontSize: 16,
    fontFamily: FONTS.Bold700,
    color: '#123F67',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  footerLeft: {
    flex: 1,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: FONTS.Bold700,
    lineHeight: 23,
    color: '#0F0F0F',
  },
  acceptButton: {
    backgroundColor: '#005680',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButtonsContainer: {
    backgroundColor: '#CCE3F4',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    width: 42,
  },
  footerRight: {
    alignItems: 'center',
  },
  cancelText: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
  buttonText: {
    backgroundColor: '#005680',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    width: 100,
    color: 'white',
  },
  actionButton: {},
});

export default PostCard;
