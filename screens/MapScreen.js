import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity, PermissionsAndroid } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import MapView, { Marker, Callout, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import HeaderButton from "../components/HeaderButton";
import Colors from "../constants/Colors";
import * as parkingLotData from "../data/parking-lot-data";

//Paul's Google Console API Key (feel free to use)
const GOOGLE_MAPS_APIKEY = 'AIzaSyBWVY8ngc7eLkds7S05Por2VjDFj7joI2o';

const dHeight = Dimensions.get("window").height;
const dWidth = Dimensions.get("window").width;

//Variables: lat and long delta as variables to not change in this case
var LATITUDE_DELTA = 0.0922,
  LONGITUDE_DELTA = 0.0421;

//Other variables (for geolocation.watchPosition)
var actualUserDest,
  watchID,
  watchOptions = {
    enableHighAccuracy: true, //High accuracy (within ~5 meters of users position).
    timeout: 20000, //20000 second timeout to fetch location (user may have bad service or connection).
    maximumAge: 10000, //Accept last known location if not older than 10000ms (milliseconds).
  };

//Const variables to be used
//Map region
const initialMapRegion = {
  latitude: 47.0073,
  longitude: -120.5363,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
};

//Const variables for testing cases.
const testMarker = {
  latitude: 47.3288,
  longitude: -122.09285
};

const surcLot = {
  latitude: 47.0022,
  longitude: -120.5372
};

const MapScreen = props => {
  //States used throughout code
  const [selectedLot, setSelectedLot] = useState(null);
  const [userOrigin, setUserOrigin] = useState(null);
  const [userDest, setUserDest] = useState(null);
  const [lotIndex, setLotIndex] = useState(0);
  const [disable, setDisable] = useState(true);

  const selectLocationHandler = event => { };

  //From here
  if (Platform.OS === "android") {
    //This does all Android location handling. Currently doesn't work with watchPosition, so uses getCurrentPosition instead.
    function getAndroidLoc() {
      navigator.geolocation.getCurrentPosition((position) => {
        let concatOrigCoords = position.coords.latitude + "," + position.coords.longitude;
        setUserOrigin(concatOrigCoords || userOrigin);
      }, (error) => {
        console.log(error);
      }, watchOptions);
    }

    getAndroidLoc();
  }
  //To here is Android location servicing. Works, and user location now shows.

  //If platform is iOS, then watches id for user movement tracking and updating.
  if (Platform.OS === "ios") {
    function watching(position) {
      let region = { //position parameter has a latitude and longitude accessed by position.coords.*
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA * 1.5,
        longitudeDelta: LONGITUDE_DELTA * 1.5
      }
      let concatOrigCoords = region.latitude + "," + region.longitude;
      setUserOrigin(concatOrigCoords || userOrigin);
      navigator.geolocation.clearWatch(watchID);
    }

    function error(err) {
      console.log(err);
    }

    function watchUserMovement() {
      watchID = navigator.geolocation.watchPosition(watching, error, watchOptions);
    }

    //*KEEP BELOW FUNCTION*
    //Helps solve E_PERMISSION errors on iOS.

    /*function getUserStart() {
        navigator.geolocation.getCurrentPosition((position) => {
          let region = { //position parameter has a latitude and longitude accessed by position.coords.*
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA * 1.5,
            longitudeDelta: LONGITUDE_DELTA * 1.5
          }
          let concatOrigCoords = region.latitude +","+ region.longitude;
          setUserOrigin(concatOrigCoords || userOrigin);
        }, error, watchOptions
      )};*/

    //getUserStart();
    watchUserMovement();
  }

  //This updates users destination
  function toggleUserDest(lot) {
    return (lot.PIN_COORDINATES[0] + "," + lot.PIN_COORDINATES[1]);
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialMapRegion}
        showsUserLocation={true} // does not work on Android
        showsMyLocationButton={true}
        showsTraffic={true}
        zoomEnabled={true}
        showsBuildings={true}
        showsCompass={true}
        toolbarEnabled={true} // does not seem to work
        loadingEnabled={true}
        loadingIndicatorColor={Colors.cwuRed}
        loadingBackgroundColor={Colors.cwuBlack}
      >
        {parkingLotData.parkingLots.map(lot => (
          <Polygon //Polygon is now just to show full parking lot area
            key={lot.LOT_ID}
            coordinates={lot.POLYGON_COORDINATES}
            strokeColor={Colors.cwuBlack}
            fillColor={"rgba(255, 51, 51, 0.4)"}
            strokeWidth={3}
          />
        ))}
        {parkingLotData.parkingLots.map(lot => (
          <Marker
            onPress={() => {
              setSelectedLot(lot);
              if (lot.LOT_ID === "G-15") { //Based on lot, toggle that information into modal.
                setLotIndex(0); //Sets the lot index for pulling information (LOT_DESCRIPTION)
                actualUserDest = toggleUserDest(lot); //Sets the variable actualUserDest to the return value of userDestUpdate
                setDisable(false);  //Sets directions button touching to allow for mapping directions.
              } else if (lot.LOT_ID === "E-13") {
                setLotIndex(1);
                actualUserDest = toggleUserDest(lot);
                setDisable(false);
              } else if (lot.LOT_ID === "E-14") {
                setLotIndex(2);
                actualUserDest = toggleUserDest(lot);
                setDisable(false);
              } else if (lot.LOT_ID === "H-15") {
                setLotIndex(3);
                actualUserDest = toggleUserDest(lot);
                setDisable(false);
              } else {
                console.log("Lot doth not existeth");
              }
            }}
            key={lot.LOT_ID}
            coordinate={{
              latitude: lot.PIN_COORDINATES[0],
              longitude: lot.PIN_COORDINATES[1]
            }}
            pinColor={Colors.cwuRed}
          >
            <Callout style={styles.calloutContainer}>
              <Text style={styles.textColor}>{lot.LOT_TYPE}</Text>
              <Text style={styles.textColor}>{lot.LOT_DESCRIPTION}</Text>
            </Callout>
          </Marker>
        ))}
        {/*TouchableOpacity as directions button on top of screen*/}
        <MapViewDirections
          origin={userOrigin}
          destination={userDest}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="rgb(60, 145, 240)"
          language="en"
          mode="WALKING" //Mode can be "WALKING", "BICYCLING", "DRIVING" or "TRANSIT"
          precision="high"
          resetOnChange={false}
        />
        </MapView>
        { /*Split the mapview to only items for the map and view for touchable opacity set
            allows for the below items to have an absolute position and not change in relation
            to other objects, e.g. the items in MapView*/}
        <View style={styles.secondView}>
        <TouchableOpacity
          disabled={disable} //Starts disabled as it may throw an error if no direction was there to map to.
          style={styles.buttonStyle}
          onPress={() => {
            setUserDest(actualUserDest)
            setDisable(true)
          }} //Set userDest to the variable defined beforehand
          underlayColor={Colors.cwuRed}>
          <Text style={styles.buttonTextStyle}>
            Directions
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
    height: 100,
    zIndex: 9,
    backgroundColor: "white",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "column",
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
  secondView: {
    width: "40%",
    marginBottom: 15,
    position: "absolute",
    left: (dWidth * 0.30),
    bottom: 0,
    shadowOffset: {width: -5, height: 5},
    shadowColor: "pink",
    shadowOpacity: 0.75,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.cwuBlack,
  }
});

export default MapScreen;