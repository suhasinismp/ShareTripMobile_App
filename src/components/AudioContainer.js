import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './ui/CustomText';
import LottieView from 'lottie-react-native';
import AudioPlayer from './AudioPlayer';

const AudioContainer = ({
  isRecording,
  recordedAudioUri,
  onRecordingComplete,
  onDelete,
}) => {
  const [recording, setRecording] = useState();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    }
  }, [isRecording]);

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
      setIsPaused(false);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(undefined);
    setIsPaused(false);
    setRecordingDuration(0);
    onRecordingComplete(uri);
  };

  const deleteRecording = async () => {
    if (recording && isPaused) {
      try {
        await recording.stopAndUnloadAsync();
        setRecording(undefined);
        setIsPaused(false);
        setRecordingDuration(0);
        onDelete();
        if (onRecordingComplete) {
          onRecordingComplete(null);
        }
      } catch (err) {
        console.error('Failed to delete recording', err);
      }
    }
  };

  const pauseRecording = async () => {
    if (recording) {
      try {
        await recording.pauseAsync();
        setIsPaused(true);
      } catch (err) {
        console.error('Failed to pause recording', err);
      }
    }
  };

  const resumeRecording = async () => {
    if (recording) {
      try {
        await recording.startAsync();
        setIsPaused(false);
      } catch (err) {
        console.error('Failed to resume recording', err);
      }
    }
  };

  if (isRecording) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.animationContainer}>
            <LottieView
              autoPlay
              loop={!isPaused}
              style={styles.lottieView}
              source={{
                uri: 'https://lottie.host/e9b5da13-9e40-4a34-aded-a3852c365ae6/r6wYS6uXgj.json',
              }}
              resizeMode="cover"
            />
          </View>

          <CustomText
            text={formatTime(recordingDuration)}
            style={styles.recordingTimer}
          />
        </View>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={deleteRecording}
            style={[styles.recordButton, !isPaused && styles.disabledButton]}
            disabled={!isPaused}
          >
            <Ionicons
              name="trash-sharp"
              size={24}
              color={isPaused ? 'red' : '#ffcccc'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={isPaused ? resumeRecording : pauseRecording}
            style={styles.recordButton}
          >
            <Ionicons name={isPaused ? 'mic' : 'pause'} size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={stopRecording} style={styles.recordButton}>
            <Ionicons name="checkmark" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return recordedAudioUri ? (
    <AudioPlayer url={recordedAudioUri} onDelete={onDelete} />
  ) : null;
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  recordButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  animationContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  lottieView: {
    width: '100%',
    height: 10,
  },
  recordingTimer: {
    fontSize: 14,
    fontWeight: '500',
    color: 'red',
    paddingRight: 10,
  },
});

export default AudioContainer;
