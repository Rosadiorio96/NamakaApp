import { WebView } from 'react-native-webview';
import React, { Component , useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList,  RefreshControl, ActivityIndicator } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { Var } from './api/Var.js';
import BackgroundTimer from 'react-native-background-timer';
import { api_modify_position } from './api/api.js';
import {uri} from './api/api.js'

var stringify;
var myJSON;
var savedBottle;
var name;




const find_position_user = async ()=>{
  if(name != undefined){

  var payload = {}
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((position) => {
          console.log(position["coords"]["latitude"])
          console.log(position["coords"]["longitude"])
          payload['latitudine'] =  position["coords"]["latitude"];
          payload["longitudine"] = position["coords"]["longitude"];
          api_modify_position(payload);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
    } else {
      console.log("location permission denied");
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err);
  } 
} else {
  console.log("name", name);
}
  }

BackgroundTimer.runBackgroundTimer(() => { 
  console.log("Ciao!");
  find_position_user();
},60000);




export const HomePage = ({ route, navigation}) => {
  name = route.params;
  
 


  useEffect(()=>{
    console.log("Useeffect")
   
    find_position_user();
    return () => {

    }

  }, [])

  

  console.log("getData Position")
  console.log(name["name"])
  if (name["name"]!= undefined){
    const apiURL2 = uri + "allposition/"+name["name"]
    console.log(apiURL2)
    fetch(apiURL2).then((res2)=>res2.json()).then((resJson2)=>{
      Var.mark = resJson2['borracce']
  })
  }

 

  return (
    <View  style={{height: "95%"}}>

            <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                        onPress={() => {navigation.navigate('BorraccePage', { name: name["name"] })}}>
              <Text style={{color: "white"}}> Visualizza le tue borracce</Text>
      </TouchableOpacity>



      <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center", marginTop: 5}}
                        onPress={() => {navigation.navigate('GraphPage', { name: name["name"] })}}>
              <Text style={{color: "white"}}> Progressi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center", marginTop: 5}}
                        onPress={() => {                        
                          navigation.navigate('MapPage', { name: name["name"], pos: Var.mark })}}>
              <Text style={{color: "white"}}> Mappa</Text>
      </TouchableOpacity>
  
    
    </View>

    
);
}






const style = StyleSheet.create({
  cointainer:{
    marginTop:20,
    backgroundColor: '#f5fcff',
    flex: 1,
     paddingBottom: 5 
  },
  itemRow: {
    borderBottomColor: '#ccc',
    marginBottom:10,
    borderBottomWidth:1
  },

  buttonBottle: {
    paddingBottom: 20,
    alignItems: 'center',
},
titleBorracce:{
  fontSize: 20,
  fontWeight: "bold",
  paddingBottom: 20,
  textAlign: 'center',
},
loader:{
marginTop: 10,
alignItems: 'center'
},

textInputStyle: {
  height: 50,
  borderWidth: 1,
  paddingLeft: 20,
  margin: 5,
  borderColor: '#009688',
  backgroundColor: 'white'
}

});