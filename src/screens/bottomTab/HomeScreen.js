import React, { useState ,useEffect} from 'react';
import { StyleSheet, Text , Modal,View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchUserMetaData } from '../../services/signinService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import CustomModal from '../../components/ui/CustomModal';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

const [isModalVisible, setIsModalVisible]= useState(false);
const navigation = useNavigation();
const userData =useSelector(getUserDataSelector)
const userId =userData.userId
const userToken =userData.userToken

useEffect(()=>{
  getUserMetaData()
},[userId,userToken])

const getUserMetaData =async()=>{
  const response =await fetchUserMetaData(userId, userToken) 
  if (response.userStatus.vehicleStatusExists == false || response.userStatus.vehicleDocStatusExists == false || response.userStatus.userDocStatusExists ==false || response.userStatus.userBusinessStatusExists ===false ||response.userStatus.userSubscriptionStatusExists== false){
    setIsModalVisible(true); 
    
  }     

}
const handleCancel = () => {
  setIsModalVisible(false); 
};

const handleGoToprofile = () => {
  navigation.navigate('Profile');
 setIsModalVisible(false); 
};

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Home Screen</Text> */}
      
        <View style={styles.modalContainer}>
          {/* <Text>Some required information is missing!</Text> */}
       
        {/* {isModalVisible && ( */}
            <CustomModal
              title='Complete Your profile to boost your visibility and build trust with fellow drivers '
              cancel='Cancel'
              action='Go to profile'
              onCancel={handleCancel}
              onAction={handleGoToprofile}
            />
        {/* )} */}
            </View>
     
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default HomeScreen;
