import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getMlServerUrl } from '../config/network';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back'); // 'back' or 'front'
  const [detections, setDetections] = useState([]);
  const cameraRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const alertTimerRef = useRef(null);

  // Capture and send frame to backend every 500ms
  // Inside your useEffect
useEffect(() => {
  let interval;
  if (permission?.granted) {
    interval = setInterval(async () => {
      if (!cameraRef.current) return;

      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 }); // reduced size
        const response = await fetch(`${getMlServerUrl()}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: photo.base64 }),
        });
        const result = await response.json();
        const dets = result.detections || [];
        setDetections(dets);

        // Trigger in-app banner if drowsy detected (label "0")
        if (dets.some(d => d.label === "0")) {
          setAlertVisible(true);
          if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
          alertTimerRef.current = setTimeout(() => setAlertVisible(false), 2000);
        }
      } catch (err) {
        console.log('Error detecting:', err);
      }
    }, 1000); // increased interval to 1 second
  }
  return () => clearInterval(interval);
}, [permission]);


  if (!permission) {
    return <View style={styles.center}><Text>Loading…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>We need your permission to show the camera</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {alertVisible && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>Drowsiness detected!</Text>
        </View>
      )}

      {/* Overlay detections */}
      {detections.map((item, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: item.x * screenWidth,
            top: item.y * screenHeight,
            width: item.width * screenWidth,
            height: item.height * screenHeight,
            borderWidth: 2,
            borderColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={styles.label}>
            {item.label} ({Math.round(item.confidence * 100)}%)
          </Text>
        </View>
      ))}

      <View style={styles.controls}>
        <Button
          title={`Flip to ${facing === 'back' ? 'front' : 'back'}`}
          onPress={() => setFacing(prev => (prev === 'back' ? 'front' : 'back'))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  controls: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  alertBanner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b91c1c',
  },
  alertText: {
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  label: {
    color: 'red',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    fontSize: 12,
  },
});
