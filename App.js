//Imports
import React, { Component, useState } from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity, Icon } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps'; //For PROVIDER_GOOGLE, need API key from Google.
import { Marker } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';

//Variables: lat and long delta as variables to not change in this case
var LATITUDE_DELTA = 0.0922,
    LONGITUDE_DELTA = 0.0421;

export default class App extends Component {
    //Constructor with parameter props, properties, is read-only
    //and is used for passing data from one component to another.
    constructor(props) {
        super(props);
        //Create a null state that is able to have all needed info for access
        this.state = {
            mapRegion: null,
            lastLat: null,
            lastLong: null,
            error: null
        };
    }

    //This method watches location and calls the update to region as necessary.
    componentDidMount() {
        this.watchID = navigator.geolocation.watchPosition( //watchPosition feeds this.watchID with constantly updated location.
            (position) => {
                let region = { //position parameter has a latitude and longitude accessed by position.coords.*
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA*1.5,
                    longitudeDelta: LONGITUDE_DELTA*1.5
                }
                this.onRegionChange(region, region.latitude, region.longitude); //When region changes, go into onRegionChange to update info.
            }, (error) => { console.log(error) }, //If error occurs, output to screen.
            {
                enableHighAccuracy: true, //High accuracy (within ~5 meters of users position).
                timeout: 20000, //20000 second timeout to fetch location (user may have bad service or connection).
                maximumAge: 10000, //Accept last known location if not older than 10000ms (milliseconds).
            }
        );
    }

    //This method updates region as needed.
    onRegionChange(region, lastLat, lastLong) {
        this.setState({
            mapRegion: region, //Region of state created in constructor is set to region parameter.
            //If there are no new values set the current ones.
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    //Stops watching.
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    //This method comes up with an error when "Directions" button is tapped in app
    //with RNGooglePlaces() null error.
    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal().then((place) => {
            //place represents user's selection from the suggestions and it is a simplified Google Place object.
            console.log(place);
        }).catch(error => console.log(error.message)); //Error is a Javascript error object.
    }

    //Renders the app.
    render() {
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE} //Specify provider is google (Google Maps use. Otherwise uses default maps).
                    style={styles.map} //Sets style to map (from const style function).
                    enableHighAccuracy={true} //High accuracy for tracking (within ~5 meters again).
                    followsUserLocation={true} //Track users location as they move (Along without watch location can be semi-glitchy).
                    rotateEnabled={true} //Allows maps to rotated in app.
                    showsBuildings={true} //Buildings are shown/marked (Starbucks, Fred Meyer, etc).
                    showsCompass={true} //Compass is shown when rotating to know direction facing.
                    showsUserLocation={true} //Users location is shown. In iOS, automatically prompts user for location services, Android requires more steps.
                    showsTraffic={true} //Traffic is marked on map (Green, orange/yellow, red, black).
                    zoomEnabled={true} //Allows user to zoom in and out on map in app.
                    zoomControlEnabled={true} //Allows user to zoom in or out secific amounts in app on map.
                    initialRegion={this.state.mapRegion} //Sets initial region to this.state.mapRegion, which is users location.
                    //As user moves, change region of user (below).
                    onRegionChange={this.onRegionChange.bind(this)}>
                    <Marker
                        //Marker on my house to show how markers work.
                        coordinate={{ latitude: 47.32880, longitude: -122.09285 }}
                        title={"McCafferty Household"}
                        description={"My Home"}
                    />
                </MapView>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.openSearchModal()}
                >
                    <Text>Directions</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

//Sets the style for the item view in the app.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        top: 10,
    },
    button: {
        position: 'absolute',
        top: 50,
        right: 175,
        backgroundColor: 'transparent'
    },
});
