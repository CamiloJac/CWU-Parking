import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";

import Colors from "../constants/Colors";

const LandingScreen = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        By accessing this application, you agree to assume the responsibilty to
        drive safely and to observe and obey all traffic laws.
      </Text>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            title="I Agree"
            color={Colors.cwuRed}
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
    backgroundColor: Colors.accent,
    width: "100%"
  },
  text: {
    color: Colors.cwuBlack,
    fontSize: 22,
    textAlign: "center"
  },
  buttonContainer: {
    borderRadius: 10,
    margin: 5,
    padding: 15
  },
  bottomContainer: {
    justifyContent: "center",
    width: "90%",
    margin: 20,
    padding: 10
  },
  button: {}
});

export default LandingScreen;
