import { WebView } from 'react-native-webview';
import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, TextInput, BackHandler, TouchableOpacity, View, Button } from 'react-native';
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import QRCodeScanner from 'react-native-qrcode-scanner';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { api_add_Bottle, logout, exit_app } from './api/api';
import {Var} from './api/Var.js'
import { Appbar, Menu, Provider } from 'react-native-paper'; 
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
  const isFocused = useIsFocused();
  const [visibleMenu, setvisibleMenu] = useState(false);

  const openMenu = () => setvisibleMenu(true);

  const closeMenu = () => setvisibleMenu(false);

  const backAction = () => {
   navigation.navigate('BorraccePage', { name: Var.username })
  };

  useEffect(() => {
    console.log("Var", Var.username)
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        exit_app
      );
  
      return () => backHandler.remove();

  }, [isFocused]);



  return (
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
  <View  style={{height: "90%", justifyContent: 'center', marginTop:"20%" }}>
    <QRCodeScanner
    onRead={find_position_bottle}
    topContent={
      <Text style={styles.centerText}>
        Inquadra il qrcode della tua borraccia!
      </Text>
    }
  />
  </View>
  </View>
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