import React, { Component,useState, useEffect } from 'react';
import { StyleSheet, Text, Animated, TextInput, View, SafeAreaView} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg'
import { useIsFocused } from "@react-navigation/native";
import { Var } from './Var.js';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';




export const MapScreen = ({ route, navigation }) => {

     return(
        <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >

            <Marker
                coordinate={
                        {
                          latitude: 40.97747520000000,
                          longitude: 14.20598740000000,
                        }
                }

               
            />
        </MapView>
      </View>
     )

  }
  
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });