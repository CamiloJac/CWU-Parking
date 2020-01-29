import React, { useState, Component } from "react";
import { View, Text, StyleSheet, Platform, Dimensions, PermissionsAndroid } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import MapView, {
  Marker,
  Callout,
  Polygon,
  PROVIDER_GOOGLE,
  AnimatedRegion
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import HeaderButton from "../components/HeaderButton";
import Colors from "../constants/Colors";
import * as parkingLotData from "../data/parking-lot-data";

const GOOGLE_MAPS_APIKEY = 'AIzaSyBWVY8ngc7eLkds7S05Por2VjDFj7joI2o';

//Variables: lat and long delta as variables to not change in this case
var LATITUDE_DELTA = 0.0922,
    LONGITUDE_DELTA = 0.0421;

//Other variables (for geolocation.watchPosition)
var watchID,
    watchOptions = {
      enableHighAccuracy: true, //High accuracy (within ~5 meters of users position).
      timeout: 20000, //20000 second timeout to fetch location (user may have bad service or connection).
      maximumAge: 10000, //Accept last known location if not older than 10000ms (milliseconds).
    };

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
  const [selectedLot, setSelectedLot] = useState(null);
  const [userOrigin, setUserOrigin] = useState(null);

  const selectLocationHandler = event => {};

  //From here
  if (Platform.OS === "android") {
    async function requestGeolocationPermission() {
      try{
        const granted = await PermissionsAndroid.request( //Requests permission to Android on startup or refresh
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, //^ Need to fix to only one-time event.
          {
            'title': "CWU Parking Application requires location services",
            'message': "CWU Parking Application uses your location to better provide an accurate and efficient route map"
          }
        );

        if(granted === PermissionsAndroid.RESULTS.GRANTED){
          console.log("Permission Granted")
        }else{
          console.log("Permission Denied")
        }
      }catch(error){
        console.warn(error)
      }
    }

    requestGeolocationPermission();
  }

  //This does all Android location handling. Currently doesn't work with watchPosition, so uses getCurrentPosition instead.
  function getAndroidLoc() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(JSON.stringify(position.coords.latitude)); //Log coords to console to show working.
      console.log(JSON.stringify(position.coords.longitude));
      let concatOrigCoords = position.coords.latitude + "," + position.coords.longitude;
      setUserOrigin(concatOrigCoords || userOrigin);
    }, (error) => {
      console.log(error);
    }, watchOptions);
  }

  if (Platform.OS === "android") {
    getAndroidLoc();
  }
  //To here is android location servicing. Works, but user location will not show on android.
  //Must customize placement marker.
  
  //If platform is iOS, then watches id for user movement tracking and updating.
  if (Platform.OS === "ios") {
    function watching(position) {
      let region = { //position parameter has a latitude and longitude accessed by position.coords.*
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA * 1.5,
        longitudeDelta: LONGITUDE_DELTA * 1.5
      }
      let concatOrigCoords = region.latitude +","+ region.longitude;
      setUserOrigin(concatOrigCoords || userOrigin);
      navigator.geolocation.clearWatch(watchID);
    }

    function error(err) {
      console.log(err);
    }

    function watchUserMovement() {
      watchID = navigator.geolocation.watchPosition(watching, error, watchOptions);
    }

    watchUserMovement();
  }
  
  return (
    //<View style={styles.container}>
    //  <Text>MapScreen</Text>
    //</View>
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
        <Polygon
          key={lot.LOT_ID}
          coordinates={lot.POLYGON_COORDINATES}
          strokeColor={Colors.cwuBlack}
          fillColor={"rgba(49, 156, 226, 0.4)"}
          strokeWidth={1.5}
          tappable={true}
          onPress={() => {}} // could make the polygon do something when tapped
        />
      ))}
      {parkingLotData.parkingLots.map(lot => (
        <Marker
          onPress={() => {
            setSelectedLot(lot);
          }}
          key={lot.LOT_ID}
          coordinate={{
            latitude: lot.PIN_COORDINATES[0],
            longitude: lot.PIN_COORDINATES[1]
          }}
        >
          <Callout>
            <Text>{lot.LOT_ID}</Text>
          </Callout>
        </Marker>
      ))}
      <MapViewDirections
        origin={userOrigin}
        destination={surcLot}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={5}
        strokeColor="rgb(60, 145, 240)"
        language="en"
        mode="WALKING" //Mode can be "WALKING", "BICYCLING", "DRIVING" or "TRANSIT"
        precision="high"
        resetOnChange={false}
      />
    </MapView>
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
            //navData.navigation.toggleDrawer(); does not work yet
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});

export default MapScreen;