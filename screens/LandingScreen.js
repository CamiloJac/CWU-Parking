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
      <View style={styles.buttonContainer}>
        <Button
          title="I Agree"
          color={Colors.cwuRed}
          onPress={() => {
            props.navigation.navigate("Map");
          }}
        />
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
    backgroundColor: "#efe4d1"
  },
  text: {
    color: Colors.cwuBlack,
    fontSize: 22
  },
  buttonContainer: {
    textAlign: "center",
    margin: 5,
    padding: 15,
  }
});

export default LandingScreen;
