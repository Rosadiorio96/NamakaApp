import React, { Component,useState, useEffect } from 'react';
import { StyleSheet, Text, Animated, TextInput, View, SafeAreaView} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg'
import { useIsFocused } from "@react-navigation/native";
import { Var } from './api/Var.js';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

var name;


export const MapScreen = ({ route, navigation }) => {
    name = route.params;

    console.log("MAPPA POS",name["pos"])
    const found = name["pos"].find(element => element.title === "UTENTE");
    if(found == undefined){
      name["pos"].push({"coordinates": {"latitude": Var.lat_user, "longitude": Var.lon_user}, "title": "UTENTE", "pinColor": "#474744"})
    }
    console.log("aaaaaaaaaaa",Var.lat_user)
   

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
              latitude: Var.lat_user,
              longitude: Var.lon_user, 
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
              {
                name["pos"].map((marker, index) => (
   
                  <MapView.Marker key={index}
                    coordinate={marker.coordinates}
                    title={marker.title}
                    pinColor={marker.pinColor}
                  />
                  
                ))
             }
          </MapView>
          :
          <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: Var.lat_user,
            longitude: Var.longitude, 
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
            <MapView.Marker 
                  coordinate={{"latitude": Var.lat_user, "longitude": Var.longitude}}
                  title="UTENTE"
                  pinColor="#474744"
                />
        </MapView>

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