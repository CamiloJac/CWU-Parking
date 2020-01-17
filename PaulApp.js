//Imports
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps'; //For PROVIDER_GOOGLE, need API key from Google.
import { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
//import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

//Variables: lat and long delta as variables to not change in this case
var LATITUDE_DELTA = 0.0922,
    LONGITUDE_DELTA = 0.0421;

//Const variables for testing cases.
const testMarker = {
    latitude: 47.32880,
    longitude: -122.09285,
}

const surcLot = {
    latitude: 47.0022,
    longitude: -120.5372,
};

//This is my google API key.
//(Feel free to use it or put in your own. Just ask me for the five missing symbols (where the five X's are))
//(The five X's are only if I remember to put them in)
const GOOGLE_MAPS_APIKEY = 'AIzaSyBWVY8ngc7eLkds7S05Por2VjDFj7joI2o';

export default class App extends Component {
    //Constructor with parameter props, properties, is read-only
    //and is used for passing data from one component to another.
    constructor(props) {
        super(props);
        //Create a null state that is able to have all needed info for access.
        this.state = {
            mapRegion: null,
            lastLat: null,
            lastLong: null,
            originLoc: null //Hasn't mapped to Arizona the past 14 times.
        };
    }

    /**
     * This method sets the state values for the distance to the location.
     * 
     * @param {any} distance The distance to the dest in !kilometers!
     * @param {any} duration_in_traffic Currently returns NaN everytime. Should return the time to destination.
     */
    setDistance(distance, duration_in_traffic) {
        this.setState({
            distance: parseFloat(distance),
            durationInTraffic: parseInt(duration_in_traffic)
        });
    }

    /**
     * This method watches location and calls the update to region as necessary.
     */
    componentDidMount() {
        this.watchID = navigator.geolocation.watchPosition( //watchPosition feeds this.watchID with constantly updated location.
            (position) => {
                let region = { //position parameter has a latitude and longitude accessed by position.coords.*
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA * 1.5,
                    longitudeDelta: LONGITUDE_DELTA * 1.5
                }
                let concatCoords = region.latitude + "," + region.longitude;
                this.setState({ //Setting the state created in constructor here on mount.
                    mapRegion: region, //Region of state created in constructor is set to region parameter.
                    lastLat: region.latitude || this.state.lastLat, //If there are no new values set the current ones.
                    lastLong: region.longitude || this.state.lastLong,
                    originLoc: concatCoords //Origin location (used for directions)
                });
            }, (error) => { console.log(error) }, //If error occurs, output to screen.
            {
                enableHighAccuracy: true, //High accuracy (within ~5 meters of users position).
                timeout: 20000, //20000 second timeout to fetch location (user may have bad service or connection).
                maximumAge: 10000, //Accept last known location if not older than 10000ms (milliseconds).
            }
        );
    }

    /**
     * This method stops watching the ID.
     */
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    /**
     * This method renders the app.
     */
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
                >
                    <Marker
                        //Marker on whatever location is chosen to show how markers work.
                        coordinate={surcLot}
                        title={"Your Destination"}
                        description={"Current Destination"}
                    />
                    <MapViewDirections //This does the whole directions, thanks to GOOGLE_MAPS_APIKEY.
                        origin={this.state.originLoc} //Where to start mapping from.
                        destination={surcLot} //Where to end directions.
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor='rgb(60, 145, 240)'
                        language='en'
                        mode='WALKING' //Mode can be 'WALKING', 'BICYCLING', 'DRIVING' or 'TRANSIT'.
                        precision='high'
                        resetOnChange={false}
                        onReady={(result) => { //Calls setDistance with results then console logs the results.
                            this.setDistance(result.distance, result.duration_in_traffic);
                            console.log('Distance: ' + this.state.distance + ' -- Duration: ' + this.state.durationInTraffic);
                        }}
                        onError={(error) => { //Catch and output error if any regarding MapViewDirections.
                            console.log(error);
                        }}
                    />
                </MapView>
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
    },
});