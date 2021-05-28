import React, { Component,useState, useEffect } from 'react';
import { StyleSheet, Text, Animated, TextInput, View, SafeAreaView} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg'
import { useIsFocused } from "@react-navigation/native";
import { Var } from './Var.js';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

var name;
var get_done = false;




export const MapScreen = ({ route, navigation }) => {
    name = route.params;

     return(
      <View style={{  width: "100%", height: "100%", flexDirection:'row', justifyContent: 'center',
      flexWrap: 'wrap', alignItems: 'center', }} >
        <Text style={styles.textGraph}> Dove sono tue borracce?</Text>
        <View style={styles.container}>
          {
            name["pos"] != 0
            ?
            <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={{
              latitude: name["pos"][0].coordinates["latitude"],
              longitude: name["pos"][0].coordinates["longitude"], 
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
              {
                name["pos"].map((marker, index) => (
   
                  <MapView.Marker key={index}
                    coordinate={marker.coordinates}
                    title={marker.title}
                  />
                ))
  
             }
          </MapView>
          :
          <Text style={styles.textGraph}> no borracce</Text>

          }
          

        
      </View>
      </View>
     )

  }
  
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: "80%",
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 50
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    textGraph:{
      fontSize: 20,
      fontWeight: "bold",
      textAlign: 'center',
      marginTop: 10
    },
   });