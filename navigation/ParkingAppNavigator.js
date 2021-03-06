import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LandingScreen from '../screens/LandingScreen';
import MapScreen from '../screens/MapScreen';
import Colors from "../constants/Colors";
import SettingsScreen from "../screens/SettingsScreen";

const ParkingAppNavigator = createStackNavigator(
    {
        //Landing: LandingScreen,
        //Map: MapScreen
        Landing: {
            screen: LandingScreen,
            navigationOptions: {
                headerShown: true,
            }
        },
        Map: {
            screen: MapScreen,
            navigationOptions: {
                title: 'Map Screen',
                headerLeft: () => null,
                headerStyle : {
                    backgroundColor: Colors.cwuRed
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold'
                }
            }
        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
              title: "",
              headerLeft: () => null,
              headerStyle: {
                backgroundColor: Colors.cwuRed
              },
              headerTintColor: "white"
            }
        },
    }
    // {
    //     defaultNavigationOptions: {
    //         headerStyle: {
    //             backgroundColor: Platform.OS === 'android' ? Colors.cwuRed : ''
    //         },
    //         headerTintColor: Platform.OS === 'android' ? 'white' : Colors.cwuRed
    //     }
    // }
);

export default createAppContainer(ParkingAppNavigator);