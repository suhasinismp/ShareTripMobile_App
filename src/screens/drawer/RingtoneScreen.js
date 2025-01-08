// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import AppHeader from '../../components/AppHeader';
// import PlayRing from '../../../assets/svgs/playRing.svg';
// import PauseRing from '../../../assets/svgs/pauseRing.svg';
// import SelectedRing from '../../../assets/svgs/selectedRing.svg';
// import ShareTripAudio1 from '../../../assets/ringtones/shareTripAudio1.m4a';
// // import ShareTripAudio2 from '../../../assets/ringtones/shareTripAudio2.m4a';
// import ShareTripAudio2 from '../../../assets/ringtones/shareTripAudio2.m4a';
// import ShareTripAudio3 from '../../../assets/ringtones/shareTripAudio3.m4a';
// import ShareTripAudio4 from '../../../assets/ringtones/shareTripAudio4.m4a';
// import ShareTripAudio5 from '../../../assets/ringtones/shareTripAudio5.m4a';
// import ShareTripAudio6 from '../../../assets/ringtones/shareTripAudio6.m4a';
// import ShareTripAudio7 from '../../../assets/ringtones/shareTripAudio7.m4a';
// import ShareTripAudio8 from '../../../assets/ringtones/shareTripAudio8.m4a';
// import ShareTripAudio9 from '../../../assets/ringtones/shareTripAudio9.m4a';
// import ShareTripAudio10 from '../../../assets/ringtones/shareTripAudio10.m4a';
// import ShareTripAudio11 from '../../../assets/ringtones/shareTripAudio11.m4a';
// import CustomButton from '../../components/ui/CustomButton';
// import { Audio } from 'expo-av';

// const RingtoneScreen = () => {
//   const [selectedId, setSelectedId] = useState(null);
//   const [playingId, setPlayingId] = useState(null);
//   const [sound, setSound] = useState(null);

//   const ringtones = [
//     {
//       id: '1',
//       title: 'ShareTripAudio1',
//       duration: '1 Sec',
//       audio: ShareTripAudio1,
//     },
//     {
//       id: '2',
//       title: 'ShareTripAudio2',
//       duration: '1 Sec',
//       audio: ShareTripAudio2,
//     },
//     {
//       id: '3',
//       title: 'ShareTripAudio3',
//       duration: '1 Sec',
//       audio: ShareTripAudio3,
//     },
//     {
//       id: '4',
//       title: 'ShareTripAudio4',
//       duration: '1 Sec',
//       audio: ShareTripAudio4,
//     },
//     {
//       id: '5',
//       title: 'ShareTripAudio5',
//       duration: '1 Sec',
//       audio: ShareTripAudio5,
//     },
//     {
//       id: '6',
//       title: 'ShareTripAudio6',
//       duration: '1 Sec',
//       audio: ShareTripAudio6,
//     },
//     {
//       id: '7',
//       title: 'ShareTripAudio7',
//       duration: '1 Sec',
//       audio: ShareTripAudio7,
//     },
//     {
//       id: '8',
//       title: 'ShareTripAudio8',
//       duration: '1 Sec',
//       audio: ShareTripAudio8,
//     },
//     {
//       id: '9',
//       title: 'ShareTripAudio9',
//       duration: '1 Sec',
//       audio: ShareTripAudio9,
//     },
//     {
//       id: '10',
//       title: 'ShareTripAudio10',
//       duration: '1 Sec',
//       audio: ShareTripAudio10,
//     },
//     {
//       id: '11',
//       title: 'ShareTripAudio11',
//       duration: '1 Sec',
//       audio: ShareTripAudio11,
//     },
//   ];

//   const handlePlayPause = async (id, audioUri) => {
//     if (playingId === id) {
//       // Pause the currently playing audio
//       await sound.pauseAsync();
//       setPlayingId(null);
//     } else {
//       // Play new audio
//       if (sound) {
//         await sound.unloadAsync();
//       }
//       const { sound: newSound } = await Audio.Sound.createAsync(audioUri);
//       setSound(newSound);
//       setPlayingId(id);
//       await newSound.playAsync();
//     }
//   };

//   const handleSelectAndPlay = async (id, audioUri) => {
//     setSelectedId(id);

//     if (playingId === id) return;

//     if (sound) {
//       await sound.unloadAsync();
//     }
//     const { sound: newSound } = await Audio.Sound.createAsync(audioUri);
//     setSound(newSound);
//     setPlayingId(id);
//     await newSound.playAsync();
//   };

//   const handleSave = () => {
//     // console.log(`Selected ringtone ID: ${selectedId}`);
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <TouchableOpacity
//         onPress={() => handlePlayPause(item.id, item.audio)}
//         style={styles.icon}
//       >
//         {playingId === item.id ? <PauseRing /> : <PlayRing />}
//       </TouchableOpacity>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.duration}>{item.duration}</Text>
//       </View>
//       <TouchableOpacity
//         onPress={() => handleSelectAndPlay(item.id, item.audio)}
//         style={styles.icon}
//       >
//         {selectedId === item.id ? (
//           <SelectedRing />
//         ) : (
//           <View style={styles.unselectedCircle} />
//         )}
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <AppHeader backIcon={true} title="Ringtones" />
//       <FlatList
//         data={ringtones}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         extraData={{ selectedId, playingId }}
//       />
//       <View style={styles.contain}>
//         <CustomButton
//           title="Save"
//           onPress={handleSave}
//           style={{ width: 80, height: 45 }}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     marginTop: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   icon: {
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   unselectedCircle: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: '#ccc',
//     borderRadius: 10,
//   },
//   textContainer: {
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   duration: {
//     fontSize: 12,
//     color: 'gray',
//   },
//   contain: {
//     alignItems: 'flex-end',
//     marginBottom: 20,
//     marginRight: 20,
//   },
// });

// export default RingtoneScreen;


import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AppHeader from '../../components/AppHeader';
import PlayRing from '../../../assets/svgs/playRing.svg';
import PauseRing from '../../../assets/svgs/pauseRing.svg';
import SelectedRing from '../../../assets/svgs/selectedRing.svg';
import ShareTripAudio1 from '../../../assets/ringtones/shareTripAudio1.m4a';
// import ShareTripAudio2 from '../../../assets/ringtones/shareTripAudio2.m4a';
import ShareTripAudio2 from '../../../assets/ringtones/shareTripAudio2.m4a';
import ShareTripAudio3 from '../../../assets/ringtones/shareTripAudio3.m4a';
import ShareTripAudio4 from '../../../assets/ringtones/shareTripAudio4.m4a';
import ShareTripAudio5 from '../../../assets/ringtones/shareTripAudio5.m4a';
import ShareTripAudio6 from '../../../assets/ringtones/shareTripAudio6.m4a';
import ShareTripAudio7 from '../../../assets/ringtones/shareTripAudio7.m4a';
import ShareTripAudio8 from '../../../assets/ringtones/shareTripAudio8.m4a';
import ShareTripAudio9 from '../../../assets/ringtones/shareTripAudio9.m4a';
import ShareTripAudio10 from '../../../assets/ringtones/shareTripAudio10.m4a';
import ShareTripAudio11 from '../../../assets/ringtones/shareTripAudio11.m4a';
import CustomButton from '../../components/ui/CustomButton';
import { Audio } from 'expo-av';
import { ringtoneScreenPost } from '../../services/ringtoneScreenService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';

const RingtoneScreen = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [sound, setSound] = useState(null);
  const userData = useSelector(getUserDataSelector);
  const userId = userData?.userId;
  const userToken = userData?.userToken;


  const ringtones = [
    { id: '1', title: 'ShareTripAudio1', duration: '1 Sec', audio: ShareTripAudio1 },
    { id: '2', title: 'ShareTripAudio2', duration: '1 Sec', audio: ShareTripAudio2 },
    { id: '3', title: 'ShareTripAudio3', duration: '1 Sec', audio: ShareTripAudio3 },
    { id: '4', title: 'ShareTripAudio4', duration: '1 Sec', audio: ShareTripAudio4 },
    { id: '5', title: 'ShareTripAudio5', duration: '1 Sec', audio: ShareTripAudio5 },
    { id: '6', title: 'ShareTripAudio6', duration: '1 Sec', audio: ShareTripAudio6 },
    { id: '7', title: 'ShareTripAudio7', duration: '1 Sec', audio: ShareTripAudio7 },
    { id: '8', title: 'ShareTripAudio8', duration: '1 Sec', audio: ShareTripAudio8 },
    { id: '9', title: 'ShareTripAudio9', duration: '1 Sec', audio: ShareTripAudio9 },
    { id: '10', title: 'ShareTripAudio10', duration: '1 Sec', audio: ShareTripAudio10 },
    { id: '11', title: 'ShareTripAudio11', duration: '1 Sec', audio: ShareTripAudio11 },
  ];

  const handlePlayPause = async (id, audioUri) => {
    if (playingId === id) {
      // Pause the currently playing audio
      await sound.pauseAsync();
      setPlayingId(null);
    } else {
      // Play new audio
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(audioUri);
      setSound(newSound);
      setPlayingId(id);
      await newSound.playAsync();
    }
  };

  const handleSelectAndPlay = async (id, audioUri) => {
    setSelectedId(id);


    if (playingId === id) return;

    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(audioUri);
    setSound(newSound);
    setPlayingId(id);
    await newSound.playAsync();
  };

  const handleSave = async () => {
    const finalData = {
      user_id: userId,
      offline_online_status: userData?.offline_online_status,
      mute_unmute_status: userData?.mute_unmute_status,
      buzzer_sound_new_post: selectedId,
      buzzer_sound_accepted: userData?.buzzer_sound_accepted,
      buzzer_sound_confirmed: userData?.buzzer_sound_confirmed
    }
    console.log({ finalData })
    const response = await ringtoneScreenPost(finalData)
    console.log({ response })
    if (response && response.error === false) {
      console.error("Error saving preferences:", response.message);
    } else {
      console.log("User preferences saved successfully:", response.data);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handlePlayPause(item.id, item.audio)} style={styles.icon}>
        {playingId === item.id ? <PauseRing /> : <PlayRing />}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
      <TouchableOpacity onPress={() => handleSelectAndPlay(item.id, item.audio)} style={styles.icon}>
        {selectedId === item.id ? <SelectedRing /> : <View style={styles.unselectedCircle} />}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader backIcon={true} title="Ringtones" />
      <FlatList
        data={ringtones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={{ selectedId, playingId }}
      />
      <View style={styles.contain}>
        <CustomButton
          title="Save"
          onPress={handleSave}
          style={{ width: 80, height: 45 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedCircle: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: 'gray',
  },
  contain: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },
});

export default RingtoneScreen;
