import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import CustomText from './ui/CustomText';

const AudioPlayer = ({ sound: providedSound, url }) => {
  const [sound, setSound] = useState(providedSound);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      if (url) {
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: url },
            { shouldPlay: false },
          );
          if (isMounted) {
            setSound(newSound);
          }
        } catch (error) {
          console.error('Error loading sound:', error);
        }
      }
    };

    if (url) {
      loadSound();
    }

    return () => {
      isMounted = false;
      if (sound && !providedSound) {
        sound.unloadAsync();
      }
    };
  }, [url]);

  useEffect(() => {
    if (sound) {
      sound.getStatusAsync().then((status) => {
        setDuration(status.durationMillis);
      });
      sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
    }
    return () => {
      if (sound) {
        sound.setOnPlaybackStatusUpdate(null);
      }
    };
  }, [sound]);

  const playSound = async () => {
    if (sound) {
      setIsPlaying(true);
      await sound.playFromPositionAsync(position);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      setIsPlaying(false);
      await sound.pauseAsync();
    }
  };

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const onSliderValueChange = async (value) => {
    if (sound) {
      setPosition(value);
      await sound.setPositionAsync(value);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pauseSound();
    } else {
      await playSound();
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!sound) return null;

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={togglePlayPause}
            style={styles.playPauseButton}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color="#1E3A8A"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.progressContainer}>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onValueChange={onSliderValueChange}
              minimumTrackTintColor="#808080"
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#808080"
            />
          </View>
          <CustomText text={formatTime(position)} style={styles.timeText} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  playerContainer: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  leftSection: {
    width: 50,
    backgroundColor: '#D8E6F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8FFE9',
    paddingHorizontal: 16,
  },
  playPauseButton: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
  },
});

export default AudioPlayer;
