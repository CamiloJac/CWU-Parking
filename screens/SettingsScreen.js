import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Platform,
  ImageBackground
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import * as parkingLotData from "../data/parking-lot-data";

import Colors from "../constants/Colors";

const SettingsScreen = props => {
  var isStaff = false, isGen = false, isGen24 = false, isFree = false;
  let lotData = parkingLotData.parkingLots;
  //Initialize all lots that should be shown
  for (var i = 0; i < lotData.length; i++) {
    if (lotData[i].LOT_TYPE === "Staff")
      isStaff = lotData[i].LOT_SHOW;
    if (lotData[i].LOT_TYPE === "Paid Student")
      isGen = lotData[i].LOT_SHOW;
    if (lotData[i].LOT_TYPE === "Student")
      isGen24 = lotData[i].LOT_SHOW;
    if (lotData[i].IS_FREE_PARKING === true)
      isFree = lotData[i].LOT_SHOW;
  }
  const [isStaffParking, setIsStaffParking] = useState(isStaff);
  const [isGeneralParking, setIsGeneralParking] = useState(isGen);
  const [isGeneralParking24Hr, setIsGeneralParking24Hr] = useState(isGen24);
  const [isFreeParking, setIsFreeParking] = useState(isFree);

  /**
   * useEffect() constantly call whenever a component is pressed or tapped
   * which in the filters screen will update the state of which lots should be shown
   * each time a filter is tapped.
   */
  useEffect(() => {
    let lotData = parkingLotData.parkingLots;
    for (var i = 0; i < lotData.length; i++) {
      if (lotData[i].LOT_TYPE === "Staff")
        lotData[i].LOT_SHOW = isStaffParking;
      if (lotData[i].LOT_TYPE === "Paid Student")
        lotData[i].LOT_SHOW = isGeneralParking;
      if (lotData[i].LOT_TYPE === "Student")
        lotData[i].LOT_SHOW = isGeneralParking24Hr;
      if (lotData[i].IS_FREE_PARKING === true)
        lotData[i].LOT_SHOW = isFreeParking;
    }
  })

  return (
    <View style={styles.screen}>
      {/*Setting background image to the CWU logo with red opacity*/}
      <ImageBackground style={styles.imageBack} source={require("../assets/logoCWU.jpg")}>
        </ImageBackground>
      <Text style={styles.title}>Filters</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.screenText}>Staff Parking</Text>
        <Switch
          trackColor={{ true: Colors.cwuRed }} //Track color (when switch is tapped, track color shows when switch is on)
          thumbColor={Platform.OS === "android" ? "#df2046" : ""} //Color of the switch itself
          value={isStaffParking} //Initial value. The value it's currently at
          onValueChange={newValue => setIsStaffParking(newValue)} //On tap, valuechange
        />
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.screenText}>General Campus</Text>
        <Switch
          trackColor={{ true: Colors.cwuRed }}
          thumbColor={Platform.OS === "android" ? "#df2046" : ""}
          value={isGeneralParking}
          onValueChange={newValue => setIsGeneralParking(newValue)}
        />
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.screenText}>General Campus 24HR</Text>
        <Switch
          trackColor={{ true: Colors.cwuRed }}
          thumbColor={Platform.OS === "android" ? "#df2046" : ""}
          value={isGeneralParking24Hr}
          onValueChange={newValue => setIsGeneralParking24Hr(newValue)}
        />
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.screenText}>Free Parking</Text>
        <Switch
          trackColor={{ true: Colors.cwuRed }}
          thumbColor={Platform.OS === "android" ? "#df2046" : ""}
          value={isFreeParking}
          onValueChange={newValue => setIsFreeParking(newValue)}
        />
      </View>
    </View>
  );
};

SettingsScreen.navigationOptions = navData => {
  return {
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          forceInset={{ top: 'always', horizontal: 'never' }}
          title="Close"
          iconName={Platform.OS === "android" ? "md-arrow-back" : "ios-arrow-back"}
          onPress={() => { navData.navigation.navigate("Map"); }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center"
  },
  imageBack: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    paddingTop: 20
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