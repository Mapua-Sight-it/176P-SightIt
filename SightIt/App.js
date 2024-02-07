import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('./assets/logo.png')}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('SML')}
      >
        <Text
          style={styles.text}
        >Create Map</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
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
    margin: 130
  },
  button: {
    backgroundColor: '#CF0A2C',
    width: 200,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignContent: 'center'
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25
  }
});
