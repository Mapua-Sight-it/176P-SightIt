# React Native Camera and Location App

This React Native application is designed to leverage the device's camera and location functionalities. It consists of two main features: "Read Aloud" and "Shelf Labelling."

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Expo CLI (npm install -g expo-cli)

### Installation

1. Clone the repository:

git clone <repository_url>

2. Navigate to the project directory:

cd <project_directory>

3. Install dependencies:

npm install

### Running the App

Start the Expo development server:

expo start

This will open a new tab in your default web browser with the Expo DevTools. You can run the app on an Android or iOS emulator, or scan the QR code with the Expo Go app on your mobile device.

## Features

### 1. Read Aloud

- Access the "Read Aloud" feature by tapping the corresponding button on the home screen.
- Grant camera permissions when prompted.
- The camera will open, and upon capturing an image, the app will use text-to-speech to read the captured information aloud.

### 2. Shelf Labelling

- Access the "Shelf Labelling" feature by tapping the corresponding button on the home screen.
- Enter a label in the input field and tap the "START/END" button.
- The app will use the device's location services to calculate the distance traveled between the first and second coordinates, displaying the label and distance on the screen.

## Technologies Used

- React Native
- Expo
- React Navigation
- Expo Camera
- Expo Location
- Expo Speech

Feel free to explore and enhance the app as needed!
