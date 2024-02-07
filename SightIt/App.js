import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera } from 'expo-camera';

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

const ShelfLabellingScreen = ({}) => {

}

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
});

export default MyStack;
