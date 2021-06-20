import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, BackHandler} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { Var } from './api/Var.js';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {logout, getSignIn, getTokenFromStore, uri, refresh_Access_Token, exit_app} from './api/api.js'
import { Appbar, Menu, Provider} from 'react-native-paper'; 
var name;


export const MapScreen = ({ route, navigation }) => {
    name = route.params;
    const [visibleMenu, setvisibleMenu] = useState(false);
    const [data, setData]=useState([])
    const openMenu = () => setvisibleMenu(true);

    const closeMenu = () => setvisibleMenu(false);
    const isFocused = useIsFocused();

    const backAction = () => {
     navigation.navigate('HomePage', { name: Var.username })
    };

   
    useEffect(()=>{
      getData();
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        exit_app
      );
  
      return () => backHandler.remove();
    }, [isFocused])


    getData = async () =>{
      getSignIn().then((signIn)=>{
      if (signIn == 'true'){
        getTokenFromStore().then((dati) => {
          const apiURL = uri+"api/allposition/"+Var.username
          fetch(apiURL, {
              method: 'GET',
              withCredentials: true,
              credentials: 'include',
              headers: {
                  'Authorization': dati['Token'],
                  'Content-Type': 'application/json'
              }
              }).then((res)=>{
                if(res['status']==200){
                console.log("-- L'utente è loggato! --");
                return res.json();
              } else if (res['status'] == 401){
                  refresh_Access_Token("Grppipage", navigation)
                  return false;
              } else{
                console.log("Impossibile visualizzare i gruppi! Riprova più tardi");
                return false;
              }
            }).then((resJson)=>{
                  if (resJson){
                      resJson['borracce'].push({"coordinates": {"latitude": Var.lat_user, "longitude": Var.lon_user}, "title": "UTENTE", "pinColor": "#474744"})
                      setData(resJson['borracce']);
                  }
                 
                })
              })
            }
          
          }
          )
        }
    

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
         <Menu.Item icon='account' title={Var.username} onPress={()=>{navigation.navigate("ProfilePage", {'namePage':"MapPage"}); closeMenu()}}/>
       <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
    </Appbar.Header>
    </Provider>
    </View>
    <View style={{ flex: 1, width: "95%", height:"100%", marginLeft: 10, marginTop: "15%", zIndex:99}} onTouchStart={() => closeMenu()}>
        <Text style={styles.textGraph}> Dove sono tue borracce?</Text>
        <View style={styles.container}>
          {
            data == undefined
            ?
            null
            :
            
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
                data.map((marker, index) => (
   
                  <MapView.Marker key={index}
                    coordinate={marker.coordinates}
                    title={marker.title}
                    pinColor={marker.pinColor}
                  />
                  
                ))
             }
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