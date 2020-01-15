import React from "react";
import { View, Text, Platform, SafeAreaView } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";

import LandingScreen from '../screens/LandingScreen';
import MapScreen from '../screens/MapScreen';
import Colors from "../constants/Colors";

const ParkingAppNavigator = createStackNavigator(
    {
        Landing: LandingScreen,
        Map: MapScreen
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: Platform.OS === 'android' ? Colors.cwuRed : ''
            },
            headerTintColor: Platform.OS === 'android' ? 'white' : Colors.cwuRed
        }
    }
);

export default createAppContainer(ParkingAppNavigator);