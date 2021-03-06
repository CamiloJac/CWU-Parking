import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity, Switch } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import MapView, { Marker, Callout, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import fire from "../components/fire";
import Toast from "react-native-tiny-toast";

import HeaderButton from "../components/HeaderButton";
import Colors from "../constants/Colors";
import * as parkingLotData from "../data/parking-lot-data";

//Paul's friend's Google Console API Key (Only temporary use)
const GOOGLE_MAPS_APIKEY = 'AIzaSyAZGYpEfZsVOpAfgsobGlk9lSIQQ8fw1aw';

const dHeight = Dimensions.get("window").height;

//Variables: lat and long delta as variables to not change in this case
var LATITUDE_DELTA = 0.0922,
  LONGITUDE_DELTA = 0.0421;

//Other variables (for geolocation.watchPosition)
var actualUserDest,
  watchOptions = {
    enableHighAccuracy: true, //High accuracy (within ~5 meters of users position).
    timeout: 20000, //20000 second timeout to fetch location (user may have bad service or connection).
    maximumAge: 10000, //Accept last known location if not older than 10000ms (milliseconds).
  },
  numSpotsFreeArr = [];

//Const variables to be used
//Map region
const initialMapRegion = {
  latitude: 47.0073,
  longitude: -120.5363,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
};

const MapScreen = props => {
  //States used throughout code
  const [selectedLot, setSelectedLot] = useState(null);
  const [userOrigin, setUserOrigin] = useState(null);
  const [userDest, setUserDest] = useState(null);
  const [trueFalseUM, setTrueFalseUM] = useState(false);
  const [userMode, setUserMode] = useState("DRIVING");
  const [lotIndex, setLotIndex] = useState(0);
  const [oneTime, setOneTime] = useState(true);
  var count = 0;

  if (oneTime === true) {
    const toast = Toast.showLoading("Loading Info...");
    setTimeout(() => {
      Toast.hide(toast)
    }, 4000);
    setOneTime(false);
  }

  configureLots = (lot) => {
    if (window.isStaff === false) {

    }
  }

  //Firebase data handling start
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Grab data from firebase and fill up the numSpotsFreeArr.
   */
  fetchLotData = () => {
    fire.database().ref("parkingLots/").on("value", snapshot => {
      let data = snapshot.val();
      let lot = Object.values(data); //Error being thrown here atm with values(null)
      numSpotsFreeArr = [lot.length];
      for (var i = 0; i < lot.length; i++) {
        numSpotsFreeArr[i] = lot[i].SPOTS_TOTAL - lot[i].SPOTS_TAKEN;
      }
    })
  };
  //Firebase data handling end

  /**
   * Grab user location using getCurrentPosition to avoid stack overflow of calls.
   */
  function getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let concatOrigCoords = position.coords.latitude + "," + position.coords.longitude;
      setUserOrigin(concatOrigCoords || userOrigin);
    }, (error) => {
      console.log(error);
    }, watchOptions);
  }

  getUserLocation();

  //This updates users destination
  function toggleUserDest(lot) {
    return (lot.PIN_COORDINATES[0] + "," + lot.PIN_COORDINATES[1]);
  }

  /**
   * Based on true or false value for the user mode either set to driving
   * or walking for travel mode.
   * 
   * @param {*} value New mode type for value.
   */
  function toggleMode(value) {
    setTrueFalseUM(value);
    if (trueFalseUM) { setUserMode("DRIVING"); }
    else { setUserMode("WALKING"); }
  }

  /**
   * Called when current lot is filled up.
   * Grabs the closest lot variable from lotData and set newDest there.
   * 
   * @returns {*} newDest Which is the new destination to be directed to.
   */
  function redirection() {
    let lotData = parkingLotData.parkingLots;
    let newLotID = lotData[lotIndex].LOT_CLOSEST;
    var newDest;

    for (var i = 0; i < lotData.length; i++) {
      if (lotData[i].LOT_ID === newLotID) {
        newDest = toggleUserDest(lotData[i]);
        setLotIndex(i);
      }
    }

    return newDest;
  }

  /**
   * Constantly creating an interval that calls
   * redirection when the current looked at lot is filled up.
   * 5000 is in milliseconds for intervals created and userlocation
   * and lotData fetching.
   * 
   * @returns {*} clearInterval(interval) to reset the interval creations.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      //Put in redirect here
      //console.log("Check" + (count++)); //Watch setInterval checks
      if (numSpotsFreeArr[lotIndex] === 0) {
        const toast = Toast.showLoading("Redirecting...\nChosen lot full");
        setTimeout(() => { //Causes toast to disappear after 2 seconds
          Toast.hide(toast);
        }, 2000);
        actualUserDest = redirection();
        setUserDest(actualUserDest);
      }
      getUserLocation();
      fetchLotData();
    }, 1000); //Refresh all information after 1 second
    return () => clearInterval(interval); //Returns the cleared interval to prevent stack overflow
  })

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialMapRegion}
        showsUserLocation={true} //Now works on Android (XML file editing)
        showsMyLocationButton={true}
        showsTraffic={true}
        zoomEnabled={true}
        showsBuildings={true}
        showsCompass={true}
        loadingEnabled={true}
        loadingIndicatorColor={Colors.cwuRed}
        loadingBackgroundColor={Colors.cwuBlack}
      >
        {parkingLotData.parkingLots.map(lot => ( //lot.LOT_SHOW && makes sure the lot should be shown
          lot.LOT_SHOW && <Polygon //Polygon is now just to show full parking lot area
            key={lot.LOT_ID}
            coordinates={lot.POLYGON_COORDINATES}
            strokeColor={Colors.cwuBlack}
            fillColor={"rgba(255, 51, 51, 0.4)"}
            strokeWidth={3}
          />
        ))}
        {parkingLotData.parkingLots.map(lot => (
          lot.LOT_SHOW && <Marker //lot.LOT_SHOW && makes sure lot should be shown 
            tracksInfoWindowChanges={true} //Updates information as change takes place (1-3 second delay)
            onPress={() => {
              setSelectedLot(lot);
              if (lot.LOT_ID === "H-15") { //Based on lot, toggle that information into modal.
                setLotIndex(0); //Sets the lot index for pulling information (LOT_DESCRIPTION)
                actualUserDest = toggleUserDest(lot); //Sets the variable actualUserDest to the return value of userDestUpdate
              } else if (lot.LOT_ID === "G-15") {
                setLotIndex(1);
                actualUserDest = toggleUserDest(lot);
              } else if (lot.LOT_ID === "E-14") {
                setLotIndex(2);
                actualUserDest = toggleUserDest(lot);
              } else if (lot.LOT_ID === "E-13") {
                setLotIndex(3);
                actualUserDest = toggleUserDest(lot);
              } else {
                console.log("Lot doth not existeth");
              }
            }}
            key={lot.LOT_ID}
            coordinate={{
              latitude: lot.PIN_COORDINATES[0],
              longitude: lot.PIN_COORDINATES[1]
            }}
            pinColor={lot.LOT_COLOR}
          >
            <Callout tooltip
              onPress={() => {
                setUserDest(actualUserDest);
              }}>
              {/*Inner view lets Text components be separated if need be*/}
              <View style={styles.calloutContainer}>
                <Text style={styles.textColor}>{lot.LOT_TYPE}</Text>
                <Text style={styles.textColor}># Parking Spaces Free: {numSpotsFreeArr[lot.LOT_INDEX]}</Text>
                <TouchableOpacity style={styles.dirStyle}>
                    <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>Directions</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
        <MapViewDirections
          origin={userOrigin}
          destination={userDest}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="rgb(60, 145, 240)"
          language="en"
          mode={userMode} //Mode can be "WALKING", "BICYCLING", "DRIVING" or "TRANSIT"
          precision="high"
          resetOnChange={false}
        />
      </MapView>
      { /*Split the mapview to only items for the map and view for touchable opacity set
            allows for the below items to have an absolute position and not change in relation
            to other objects, e.g. the items in MapView*/}
      <View style={styles.switchStyle}>
        <Text style={styles.switchText}> {trueFalseUM ? "Walking" : "Driving"} </Text>
        <Switch
          trackColor={{ false: "white", true: Colors.cwuRed }}
          ios_backgroundColor={"white"}
          thumbColor={Platform.OS === "android" ? "#df2046" : ""}
          value={trueFalseUM}
          onValueChange={newValue => toggleMode(newValue)}
        />
        {/*Does not half the time. May need to adjust userDest update*/}
        <TouchableOpacity
          onPress={() => {
            setUserDest(userOrigin); //Janky bypass that sets user dest to user location which clears directions.
          }}
        >
          <Text style={styles.clearDir}>
            Clear Directions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

MapScreen.navigationOptions = navData => {
  return {
    headerTitle: "Find Parking",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-settings" : "ios-settings"}
          onPress={() => {
            navData.navigation.navigate("Settings");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject, //Changed to fill device size
    zIndex: 0,
  },
  calloutContainer: {
    flex: 1,
    width: 250,
    height: 200,
    borderWidth: 4,
    borderRadius: 30,
    borderColor: Colors.cwuBlack,
    backgroundColor: "white",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "column",
  },
  dirStyle: {
    backgroundColor: Colors.cwuRed,
    borderColor: Colors.cwuRed,
    borderWidth: 6,
    borderRadius: 8
  },
  textColor: {
    fontSize: 18,
    color: Colors.cwuRed,
  },
  buttonStyle: {
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    alignItems: "center",
    backgroundColor: Colors.cwuRed,
  },
  buttonTextStyle: {
    borderRadius: 10,
    fontSize: 16,
    zIndex: 8,
    fontWeight: "bold",
    alignItems: "center",
    color: "white",
  },
  headerText: {
    color: "white",
    textAlign: "center",
    fontSize: 18
  },
  switchStyle: {
    flex: 1,
    bottom: dHeight * 0.83,
    backgroundColor: Colors.cwuBlack,
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    padding: 5,
    width: "100%",
  },
  switchText: {
    color: "white",
    padding: 5,
  },
  clearDir: {
    color: "white",
    marginLeft: 25,
    textAlign: "center",
    padding: 6,
    backgroundColor: Colors.cwuRed,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: Colors.cwuBlack,
  }
});

export default MapScreen;