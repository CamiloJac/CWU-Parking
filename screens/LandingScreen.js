import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";

import Colors from "../constants/Colors";

const LandingScreen = props => {
  return (
    <View style={styles.container}>
      {/*Setting background image to the CWU logo with red opacity*/}
      <ImageBackground style={styles.imageBack} source={require("../assets/logoCWU.jpg")}>
        </ImageBackground>
      <View style={styles.topContainer}>
        <Text style={styles.h1}>Legal Agreement</Text>
      </View>
      <View style={styles.middleContainer}>
        {/*Legal statement*/}
        <Text style={styles.h2}>
          By accessing this application, you agree to assume the responsibilty
          to drive safely and to observe and obey all traffic laws.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              //Props navigation call method of navigate to present the Map screen.
              props.navigation.navigate("Map");
            }}
            underlayColor={Colors.cwuRed}>
            <Text style={styles.buttonTextStyle}>
              I Agree
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

LandingScreen.navigationOptions = {
  headerTitle: "CWU Parking Application",
  headerStyle: {
    backgroundColor: Colors.cwuRed
  },
  headerTintColor: "white",
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
  imageBack: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  h1: {
    color: "white",
    fontSize: 40,
    textAlign: "center"
  },
  h2: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8
  },
  topContainer: {
    marginBottom: 50,
    fontWeight: "bold"
  },
  bottomContainer: {
    justifyContent: "center",
    width: "75%",
    margin: 75,
    padding: 10
  },
  buttonContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "white",
  },
  buttonStyle: {
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    alignItems: "center",
    backgroundColor: Colors.cwuBlack,
  },
  buttonTextStyle: {
    borderRadius: 10,
    fontSize: 20,
    zIndex: 8,
    fontWeight: "bold",
    alignItems: "center",
    color: Colors.cwuRed,
  }
});

export default LandingScreen;
