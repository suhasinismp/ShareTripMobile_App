import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './ui/CustomText';

const AudioContainer = ({
  isRecording,
  recordedAudioUri,
  onRecordingComplete,
  onDelete,
}) => {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const progressRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else if (recordedAudioUri && !sound) {
      loadSound(recordedAudioUri);
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [isRecording, recordedAudioUri]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      if (isPlaying) {
        pauseSound();
      }
    },
    onPanResponderMove: (_, gestureState) => {
      if (progressRef.current) {
        progressRef.current.measure((x, y, width, height, pageX, pageY) => {
          const newPosition = Math.max(
            0,
            Math.min(gestureState.moveX - pageX, width),
          );
          const newPositionMillis = (newPosition / width) * duration;
          setPosition(newPositionMillis);
        });
      }
    },
    onPanResponderRelease: async () => {
      if (sound) {
        await sound.setPositionAsync(position);
      }
    },
  });

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(undefined);
    onRecordingComplete(uri);
  };

  const loadSound = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    const status = await sound.getStatusAsync();
    setDuration(status.durationMillis);
  };

  const playSound = async () => {
    if (sound) {
      setIsPlaying(true);
      await sound.playFromPositionAsync(position);
      sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      setIsPlaying(false);
      await sound.pauseAsync();
    }
  };

  const updatePlaybackStatus = (status) => {
    if (status.isPlaying) {
      setPosition(status.positionMillis);
    } else if (status.didJustFinish) {
      setIsPlaying(false);
      setPosition(duration);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pauseSound();
    } else {
      await playSound();
    }
  };

  if (isRecording) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={stopRecording} style={styles.recordButton}>
          <Ionicons name="stop" size={24} color="red" />
        </TouchableOpacity>
        <CustomText text="Recording..." style={styles.recordingText} />
      </View>
    );
  }

  if (!sound) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="black" />
      </TouchableOpacity>
      <View
        style={styles.progressContainer}
        ref={progressRef}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.progressBar,
            { width: `${(position / duration) * 100}%` },
          ]}
        />
        <View
          style={[styles.scrubber, { left: `${(position / duration) * 100}%` }]}
        />
      </View>
      <CustomText text={formatTime(position)} style={styles.durationText} />
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  playButton: {
    padding: 5,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#008B8B',
    borderRadius: 2,
  },
  scrubber: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#008B8B',
    top: -4,
  },
  durationText: {
    fontSize: 12,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  recordButton: {
    padding: 10,
  },
  recordingText: {
    marginLeft: 10,
  },
});

export default AudioContainer;
