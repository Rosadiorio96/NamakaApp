import { WebView } from 'react-native-webview';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

var name;



const api_add_Bottle = async (payload)=>{
  console.log(payload);
  console.log(name);
  var url_2 = "http://192.168.1.90:8081/api/borracciaprop/"+ String(name["name"]);
  console.log(url_2);
  try{
    await fetch(url_2, {
      method: 'post',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => {
      console.log(response['status']);
      if(response['status']==200){
        console.log("ok");
        alert("Borraccia aggiunta correttamente");
      }
      else{
        alert("Impossibile aggiungere la borraccia");
      }});

  }catch(e){
    console.log("erroreeee");
    console.log(e);
  }
}

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
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
          api_add_Bottle(payload)
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
    console.warn(err)
  } 
  }



export const AddBottleScreen = ({ route, navigation }) => {
  name = route.params;
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