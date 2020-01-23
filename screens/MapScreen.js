import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Location, Permissions } from "expo";
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

//Const variables for testing cases.
const testMarker = {
  latitude: 47.3288,
  longitude: -122.09285
};

const surcLot = {
  latitude: 47.0022,
  longitude: -120.5372
};

const mapRegion = {
  latitude: 47.0073,
  longitude: -120.5363,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
};

const MapScreen = props => {
  const [selectedLot, setSelectedLot] = useState(null);

  const selectLocationHandler = event => {};

  return (
    //<View style={styles.container}>
    //  <Text>MapScreen</Text>
    //</View>
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={mapRegion}
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
      {/* <Polygon
        coordinates={coords}
        fillColor={"rgba(49, 156, 226, 0.4)"}
        strokeColor={Colors.cwuBlack}
        strokeWidth={1.5}
        tappable={true}
        onPress={() => {}} // could make the polygon do something when tapped
      /> */}
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
        origin={testMarker}
        destination={surcLot}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={5}
        strokeColor="rgb(60, 145, 240)"
        language="en"
      />
      {/* <Marker
        coordinate={{ latitude: 47.001389, longitude: -120.536947 }}
        pinColor={Colors.cwuRed}
      >
        <Callout>
          <Text>G-15</Text>
        </Callout>
      </Marker> */}
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
