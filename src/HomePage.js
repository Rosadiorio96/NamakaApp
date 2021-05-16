import { WebView } from 'react-native-webview';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList,  RefreshControl } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { Borracce } from './Borracce.js';

var stringify;
var myJSON;
var savedBottle;



export const HomePage = ({ route, navigation}) => {
  var name = route.params;
  
  async function getBorracce(){
    try{
      let responseb = await fetch('http://192.168.1.90:8081/api/borracciaprop/'+name["name"]);
      let responseJsonb = await responseb.json();
      console.log("borracceeeeee", responseJsonb)
      
      return responseJsonb
    }
    catch(error){
      console.error("errore??????????", (JSON.stringify(error)));
      

    }
  }
  

  
  getBorracce().then(response => {
                              console.log("rispppppp", response.borracce.length);
                              if (response.borracce.length > 0){
                                savedBottle = true;
                                Borracce.lista_borracce = response; 
                                console.log("VARIABILE",Borracce.lista_borracce);
                                myJSON = JSON.stringify(Borracce.lista_borracce.borracce);
                                stringify = JSON.parse(myJSON);
                                
                                for (var i = 0; i < stringify.length; i++) {
  
                                    console.log("aaaaaaa", stringify[i]['colore']);
                                }
                                console.log("jsonnnnnnnn",myJSON);
                              } 
                              else{
                                console.log("vuoto")
                                savedBottle = false;
                              }

                                })
 


  return (
    <View>
       
    <View>
      {
        savedBottle == true
           ?
           <View>
             <Text style={styles.titleBorracce}>Le tue borracce</Text>
              <FlatList
              data={stringify}
              renderItem={({item}) =>         
            <View style={styles.buttonBottle}>
                
                <TouchableOpacity style={{borderWidth: 1, height: 150, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                      onPress={() => {}}>
                        <Text style={{color: "white"}}>Nome: {item.id_borraccia}</Text>
                        <Text style={{color: "white"}}>Colore: {item.colore}</Text>
                        <Text style={{color: "white"}}>Capacità: {item.capacita}</Text>
                        <Text style={{color: "white"}}>Latitudine: {item.lat_borr}</Text>
                        <Text style={{color: "white"}}>Longitudine: {item.lon_borr}</Text>
                        <Text style={{color: "white"}}>Livello attuale: {item.livello_attuale}</Text>
                </TouchableOpacity>
                                       
                                       
            </View>}
           keyExtractor={(item, index) => index.toString()}
         />
           </View>


           :
          <Text style={styles.titleBorracce}>Non hai borracce associate</Text>
      }
    </View>


   


      <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                        onPress={() => {navigation.navigate('AddBottlePage', { name: name["name"] })}}>
              <Text style={{color: "white"}}> Aggiungi borraccia</Text>
      </TouchableOpacity>

  
    
    </View>

    
);
}

const styles = StyleSheet.create({
  buttonBottle: {
    paddingBottom: 20,
    alignItems: 'center',
},
titleBorracce:{
  fontSize: 20,
  fontWeight: "bold",
  paddingBottom: 20,
  textAlign: 'center',
}

});