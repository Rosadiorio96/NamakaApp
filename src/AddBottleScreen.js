import { WebView } from 'react-native-webview';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { api_add_Bottle } from './api/api';
var name;
var navigation2;



const find_position_bottle = async (e)=>{
  var payload = JSON.parse(e.data);
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((position) => {
          console.log(position);
          console.log(position["coords"]["latitude"])
          console.log(position["coords"]["longitude"])
          payload["latitudine"] =  position["coords"]["latitude"];
          payload["longitudine"] = position["coords"]["longitude"];
          api_add_Bottle(payload, navigation2)
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    } else {
      console.log("location permission denied")
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn("warn")
  } 
  }



export const AddBottleScreen = ({ route, navigation }) => {
  name = route.params;
  navigation2 = navigation;
  return (
    <QRCodeScanner
    onRead={find_position_bottle}
    topContent={
      <Text style={styles.centerText}>
        Inquadra il qrcode della tua borraccia!
      </Text>
    }
  />
);
}


const styles = StyleSheet.create({
centerText: {
flex: 1,
fontSize: 18,
padding: 32,
color: '#777'
},
textBold: {
fontWeight: '500',
color: '#000'
},
});