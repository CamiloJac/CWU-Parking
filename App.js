import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from "expo-font";

import ParkingAppNavigator from './navigation/ParkingAppNavigator';

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf")
  });
};

export default function App() {
  return (
      <ParkingAppNavigator />
  );
}