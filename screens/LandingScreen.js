import React from "react";
import { View, Text, StyleSheet, Button, Icon, TouchableOpacity } from "react-native";

import Colors from "../constants/Colors";

const LandingScreen = props => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.h1}>CWU Parking</Text>
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.h2}>
          By accessing this application, you agree to assume the responsibilty
          to drive safely and to observe and obey all traffic laws.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            title="I Agree"
            color="#df2046"
            onPress={() => {
              props.navigation.navigate("Map");
            }}
          />
        </View>
      </View>
    </View>
  );
};

LandingScreen.navigationOptions = {
  headerTitle: "CWU Parking"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.cwuRed,
    width: "100%"
  },
  h1: {
    color: "white",
    fontSize: 40,
    textAlign: "center"
  },
  h2: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 8
  },
  buttonContainer: {
    borderRadius: 10,
    margin: 5,
    padding: 15
  },
  topContainer: {
    marginBottom: 50
  },
  bottomContainer: {
    justifyContent: "center",
    width: "75%",
    margin: 20,
    padding: 10
  },
  button: {}
});

export default LandingScreen;