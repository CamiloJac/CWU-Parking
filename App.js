import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Font from "expo-font";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import ParkingAppNavigator from "./navigation/ParkingAppNavigator";
import lotsReducer from "./store/reducers/lots";

const rootReducer = combineReducers({
  lots: lotsReducer
});

const store = createStore(rootReducer);

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf")
  });
};

export default function App() {
  return (
    <Provider store={store}>
      <ParkingAppNavigator />
    </Provider>
  );
}
