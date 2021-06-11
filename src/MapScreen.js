import React, { Component,useState, useEffect } from 'react';
import { StyleSheet, Text, Animated, TextInput, View, SafeAreaView} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg'
import { useIsFocused } from "@react-navigation/native";
import { Var } from './api/Var.js';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {logout} from './api/api.js'
import { Appbar, Menu, Provider} from 'react-native-paper'; 
var name;


export const MapScreen = ({ route, navigation }) => {
    name = route.params;
    const [visibleMenu, setvisibleMenu] = useState(false);

    const openMenu = () => setvisibleMenu(true);

    const closeMenu = () => setvisibleMenu(false);
  
    const backAction = () => {
     navigation.navigate('HomePage', { name: Var.username })
    };

    console.log("MAPPA POS",name["pos"])
    const found = name["pos"].find(element => element.title === "UTENTE");
    if(found == undefined){
      name["pos"].push({"coordinates": {"latitude": Var.lat_user, "longitude": Var.lon_user}, "title": "UTENTE", "pinColor": "#474744"})
    }
    console.log("aaaaaaaaaaa",Var.lat_user)
   

     return(
      <View  style={{  height: "100%"}} >
        <View style={{ width: "100%", height:'14%', position: 'absolute', zIndex:100}} >
      <Provider>
      <Appbar.Header>
      
      <Appbar.BackAction onPress={backAction} />
      <Appbar.Content/>
        <Menu
        onDismiss={closeMenu}
        visible={visibleMenu}
        anchor={
          <Appbar.Action color="white" icon="dots-vertical" onPress={openMenu} />
        }>
         <Menu.Item icon='account' title={Var.username}/>
       <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
    </Appbar.Header>
    </Provider>
    </View>
    <View style={{ flex: 1, width: "95%", height:"100%", marginLeft: 10, marginTop: "15%", zIndex:99}} onTouchStart={() => closeMenu()}>
        <Text style={styles.textGraph}> Dove sono tue borracce?</Text>
        <View style={styles.container}>
          {
            name["pos"].length != 0
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