import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import BackIcon from '../../../assets/svgs/backIcon.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomInput from '../../components/ui/CustomInput';

const PostVacantTrip = (
  typeMessage,
  setTypeMessage
) => {

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Post Vacant trip</Text>
      <Text style={styles.modalSubtitle}>Type your message or record Voice</Text>
      <View style={styles.inputGroup}>
        <CustomInput
          placeholder="Type your Message"
          value={typeMessage}
          onChangeText={setTypeMessage}

        />
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => { }}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postButton} onPress={() => { }}>
          <Text style={styles.postButtonText}>Post Vacant</Text>
        </TouchableOpacity>
      </View>

    </View >
  );
};

const VacantTrip = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [typeMessage, setTypeMessage] = useState('');
  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}

      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {

        }}>
          <BackIcon width={24} height={24} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Vacant Trip</Text>
        <TouchableOpacity style={styles.postButton} onPress={() => { setModalVisible(true) }}>
          <Text style={styles.postButtonText}>Post Vacant Trip</Text>
        </TouchableOpacity>
      </View >
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <PostVacantTrip
            typeMessage={typeMessage}
            setTypeMessage={setTypeMessage}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  postButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#113F67',
    borderRadius: 5,

  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',

  },
});

export default VacantTrip;



// import React, { useState } from 'react';
// import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import AppHeader from '../../components/AppHeader';
// import BackIcon from '../../../assets/svgs/backIcon.svg';


// const PostVacantTrip = (
//   typeMessage,
//   setTypeMessage
// ) => {

//   return (
//     <View style={styles.modalContent}>
//       <Text style={styles.modalTitle}>Post Vacant trip</Text>
//       <Text style={styles.modalSubtitle}>Type your message or record Voice</Text>
//       <View style={styles.inputGroup}>
//         <CustomInput
//           placeholder="Type your Message"
//           value={typeMessage}
//           onChangeText={setTypeMessage}

//         />
//       </View>
//       <View style={styles.buttonGroup}>
//         <TouchableOpacity style={styles.cancelButton} onPress={() => { }}>
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.postButton} onPress={() => { }}>
//           <Text style={styles.postButtonText}>Post Vacant</Text>
//         </TouchableOpacity>
//       </View>

//     </View >
//   );
// };

// const VacantTrip = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [typeMessage, setTypeMessage] = useState('');
//   return (
//     <>
//       <AppHeader
//         drawerIcon={true}
//         groupIcon={true}
//         onlineIcon={true}
//         muteIcon={true}

//       />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => {

//         }}>
//           <BackIcon width={24} height={24} style={styles.backIcon} />
//         </TouchableOpacity>
//         <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Vacant Trip</Text>
//         <TouchableOpacity style={styles.postButton} onPress={() => { setModalVisible(true) }}>
//           <Text style={styles.postButtonText}>Post Vacant Trip</Text>
//         </TouchableOpacity>
//       </View >

//     </>
//   );
// };

// const styles = StyleSheet.create({

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   backIcon: {
//     marginRight: 10,
//   },
//   title: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalContent: {
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 20,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   postButton: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: '#113F67',
//     borderRadius: 5,

//   },
//   buttonGroup: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   cancelButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: '#ccc',
//     borderRadius: 5,
//   },
//   cancelButtonText: {
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   postButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',

//   },
// });

// export default VacantTrip;


