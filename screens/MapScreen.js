import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import MapView, { Marker, Callout, Polygon } from "react-native-maps";

import HeaderButton from "../components/HeaderButton";
import Colors from "../constants/Colors";
import { render } from "react-dom";

const MapScreen = props => {
  const coords = [
    { name: "1", latitude: 47.00102, longitude: -120.53728 },
    { name: "2", latitude: 47.001751, longitude: -120.537289 },
    { name: "3", latitude: 47.001755, longitude: -120.536464 },
    { name: "4", latitude: 47.00104, longitude: -120.536457 }
  ];

  const mapRegion = {
    latitude: 47.0073,
    longitude: -120.5363,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = event => {};

  return (
    //<View style={styles.container}>
    //  <Text>MapScreen</Text>
    //</View>
    <MapView
      style={styles.map}
      initialRegion={mapRegion}
      showsUserLocation={true} // does not work on Android
      showsMyLocationButton={true}
      showsTraffic={true}
      zoomEnabled={true}
      //minZoomLevel={3} // does not seem to work
      showsBuildings={true}
      showsCompass={true}
      toolbarEnabled={true} // does not seem to work
      loadingEnabled={true}
      loadingIndicatorColor={Colors.cwuRed}
      loadingBackgroundColor={Colors.cwuBlack}
    >
      <Polygon
        coordinates={coords}
        fillColor={'rgba(49, 156, 226, 0.4)'}
        strokeColor={Colors.cwuBlack}
        strokeWidth={1.5}
        tappable={true}
        onPress={() => {}} // could make the polygon do something when tapped
      />
      <Marker
        coordinate={{ latitude: 47.001389, longitude: -120.536947 }}
        pinColor={Colors.cwuRed}
      >
        <Callout>
          <Text>G-15</Text>
        </Callout>
      </Marker>
    </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  return {
    headerTitle: "Map",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
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
