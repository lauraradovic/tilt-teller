import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [tilt, setTilt] = useState({ x: 0, y: 0, z: 0 });
  const [bubblePosition, setBubblePosition] = useState(50);
  const [displayText, setDisplayText] = useState('Level: Centered');
  const tiltThreshold = 0.1;

  useEffect(() => {
    const subscription = Accelerometer.addListener((accelerometerData) => {
      setTilt(accelerometerData);
      updateBubblePosition(accelerometerData);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const updateBubblePosition = ({ x }) => {
    const newPosition = 50 + x * 50;
    setBubblePosition(Math.min(100, Math.max(0, newPosition)));

    const isLeveled = Math.abs(x) < tiltThreshold;

    if (isLeveled) {
      setDisplayText('Level: Centered');
    } else {
      setDisplayText(x > 0 ? 'Level: Right' : 'Level: Left');
    }
  };

  const handleTextPress = () => {
    setDisplayText('Level Teller is awesome!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.level}>
        <View style={[styles.bubble, { left: `${bubblePosition}%` }]} />
      </View>
      <Text style={styles.text}>{displayText}</Text>
      <TouchableOpacity onPress={handleTextPress}>
        <Text style={styles.text}>Tap me!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  level: {
    width: '80%',
    height: 20,
    backgroundColor: '#ddd',
    position: 'relative',
  },
  bubble: {
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
    position: 'absolute',
    top: -10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
});
