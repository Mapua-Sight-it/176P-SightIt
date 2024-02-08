import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera } from "expo-camera";
import * as Speech from "expo-speech";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
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
      <Image style={styles.logo} source={require("./assets/logo.png")} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Map_Training")}
      >
        <Text style={styles.text}>READ ALOUD</Text>
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
        if (status === "granted") {
          Speech.speak(
            "Reading...,,,,,,,,,,,,,,.. Reading...,,,,,,,,,,,,,,.. Reading...,,,,,,,,,,,,,,.. Reading Complete"
          );
          Speech.speak(" Product: Cup Noodles, Brand: Nissin, Flavor: Beef");
          // You can do something with the captured photo URI here
        } else {
          console.log("Permission denied");
        }
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const checkCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
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
        <View style={styles.cameraContainer}>
          <View style={styles.camera}>
            <Camera
              style={{ flex: 1 }} // Make the Camera component fill its parent
              type={Camera.Constants.Type.back}
              ref={cameraRef}
            />
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={[styles.captureButtonText, { color: "white" }]}>
          READ ALOUD
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

const ShelfLabellingScreen = ({}) => {

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    borderRadius: 40,
    backgroundColor: "blue",
    height: 650,
    width: 350,
    marginBottom: 50,
    overflow: "hidden",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
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
    backgroundColor: "#CF0A2C",
    opacity: 1,
    width: 200,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
  },
  captureButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#CF0A2C",
    padding: 25,
    borderRadius: 25,
    opacity: 0.7,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  camera: {
    flex: 1,
    borderRadius: 40, // Add the same borderRadius here
    overflow: "hidden", // And here
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
