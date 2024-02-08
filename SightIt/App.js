import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Map_Training'
          component={MapTrainingScreen}
        />
        <Stack.Screen
          name='Shelf_Labelling'
          component={ShelfLabellingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('./assets/logo.png')}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Map_Training')}
      >
        <Text style={styles.text}>Create Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Shelf_Labelling')}
      >
        <Text style={styles.text}>Label Shelf</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

const MapTrainingScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
          const photo = await cameraRef.current.takePictureAsync();
          console.log(photo.uri);
          // You can do something with the captured photo URI here
        } else {
          console.log('Permission denied');
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const checkCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    checkCameraPermission();
  }, []);

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
        />
      )}
      <View style={styles.buttonContainer}>
        <View style={styles.startEnd}>
          <TouchableOpacity 
            style={styles.circleBorder}
            onPress={() => navigation.navigate('Shelf_Labelling')} 
          >
            <Image
              style={styles.mic}
              source={require('./assets/mic.png')}
            />
          </TouchableOpacity>
          <Text style={styles.captureButtonText}>START/END</Text>
        </View>
        <View style={styles.startEnd}>
          <TouchableOpacity 
            style={styles.circleBorder}
          >
            <Image
              style={styles.play}
              source={require('./assets/play.png')}
            />
          </TouchableOpacity>
          <Text style={styles.captureButtonText}>ADD LABEL</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const ShelfLabellingScreen = ({ navigation }) => {
  const [label, setLabel] = useState('');
  const [location, setLocation] = useState(null);
  const [firstCoordinate, setFirstCoordinate] = useState(null);
  const [secondCoordinate, setSecondCoordinate] = useState(null);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const onChangeLabel = (text) => {
    setLabel(text);
  };

  const handleStartEndClick = () => {
    if (location) {
      if (isFirstClick) {
        setFirstCoordinate(location.coords);
      } else {
        setSecondCoordinate(location.coords);
        calculateDistance();
      }
      setIsFirstClick(!isFirstClick);
    }
  };
  
  const calculateDistance = () => {
    if (firstCoordinate && secondCoordinate) {
      const earthRadius = 6371e3; // meters
      const lat1 = firstCoordinate.latitude * Math.PI / 180;
      const lat2 = secondCoordinate.latitude * Math.PI / 180;
      const deltaLat = (secondCoordinate.latitude - firstCoordinate.latitude) * Math.PI / 180;
      const deltaLon = (secondCoordinate.longitude - firstCoordinate.longitude) * Math.PI / 180;

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = earthRadius * c;
      setDistance(distance);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: 100 }]}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeLabel}
        value={label}
        placeholder='Enter label...'
      />
      <Text style={styles.label}>
        Label: {label}
      </Text>
      <Text style={styles.distance}>
        Distance: {distance !== null && location ? `${distance.toFixed(2)} meters` : 'Calculate after second click'}
      </Text>
      {location && (
        <View>
          <Text style={styles.coordinates}>
            Latitude: {location.coords.latitude}
          </Text>
          <Text style={styles.coordinates}>
            Longitude: {location.coords.longitude}
          </Text>
        </View>
      )}
      {firstCoordinate && (
        <View>
          <Text style={styles.coordinates}>
            First Latitude: {firstCoordinate.latitude}
          </Text>
          <Text style={styles.coordinates}>
            First Longitude: {firstCoordinate.longitude}
          </Text>
        </View>
      )}
      {secondCoordinate && (
        <View>
          <Text style={styles.coordinates}>
            Second Latitude: {secondCoordinate.latitude}
          </Text>
          <Text style={styles.coordinates}>
            Second Longitude: {secondCoordinate.longitude}
          </Text>
        </View>
      )}
      <TouchableOpacity 
        style={styles.circleBorder}
        onPress={handleStartEndClick}
      >
        <Image
          style={styles.play}
          source={require('./assets/play.png')}
        />
      </TouchableOpacity>
      <Text style={styles.captureButtonText}>START/END</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    margin: 10, 
  },
  mic: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    margin: 10,
  },
  play: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    margin: 10,
  },
  button: {
    backgroundColor: '#CF0A2C',
    width: 200,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 20, 
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
  },
  startEnd: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
    marginLeft: 25,
    top: 200
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  camera: {
    height: 250,
    width: 320,
    marginTop: -300
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  circleBorder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    fontSize: 16,
    color: '#333', 
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  coordinates: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  distance: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
});

export default MyStack;
