import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Switch,
  Platform
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import Colors from "../constants/Colors";

const SettingsScreen = props => {
  const [isStaffParking, setIsStaffParking] = useState(false);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Filters</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.screenText}>Staff Parking</Text>
        <Switch
          trackColor={{ true: Colors.cwuRed }}
          thumbColor={Platform.OS === "android" ? "#df2046" : ""}
          value={isStaffParking}
          onValueChange={newValue => setIsStaffParking(newValue)}
        />
      </View>
    </View>
  );
};

SettingsScreen.navigationOptions = navData => {
  return {
    headerRight: () => (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navData.navigation.navigate("Map");
          }}
        >
          <Text style={styles.headerText}>Done</Text>
        </TouchableOpacity>
      </View>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center"
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%"
  },
  title: {
    color: Colors.cwuBlack,
    fontSize: 26,
    margin: 20,
    textAlign: "center"
  },
  screenText: {
    color: Colors.cwuBlack,
    fontSize: 20
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    alignItems: "center",
    padding: 20
  },
  headerText: {
    color: "white",
    textAlign: "center",
    fontSize: 18
  }
});

export default SettingsScreen;
