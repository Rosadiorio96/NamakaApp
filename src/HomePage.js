import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert  } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { Var } from './api/Var.js';
import BackgroundTimer from 'react-native-background-timer';
import { api_modify_position } from './api/api.js';
import {uri} from './api/api.js'
import { Button, Menu, Divider, Provider } from 'react-native-paper';

var stringify;
var myJSON;
var savedBottle;
var name;
var navigation2;



const find_position_user = async ()=>{
  if(Var.username != null){

  var payload = {}
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((position) => {
          payload['latitudine'] =  position["coords"]["latitude"];
          payload["longitudine"] = position["coords"]["longitude"];
          api_modify_position(payload, navigation2);
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
  if(Var.username != null){
    console.log("Var", Var.username)
  find_position_user();
  }
},60000);




export const HomePage = ({ route, navigation}) => {
  Var.username = route.params["name"];
  navigation2 = navigation;

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("Var", Var.username)
    if(Var.username != null){
      console.log("Use effect HomePage")
      find_position_user();
    }
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isFocused]);

  

  

  console.log("getData Position")
  console.log("Name", Var.username)
  if (Var.username!= undefined){
    const apiURL2 = uri + "allposition/"+Var.username
    console.log(apiURL2)
    fetch(apiURL2).then((res2)=>res2.json()).then((resJson2)=>{
      Var.mark = resJson2['borracce']
  })
  }

 

  return (
    <View  style={{height: "95%"}}>
<Provider>
      <View
        style={{
          paddingTop: 50,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu}>Show menu</Button>}>
          <Menu.Item onPress={() => {}} title="Item 1" />
          <Menu.Item onPress={() => {}} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>
      </View>
    </Provider>
            <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                        onPress={() => {navigation.navigate('BorraccePage', { name: Var.username })}}>
              <Text style={{color: "white"}}> Visualizza le tue borracce</Text>
      </TouchableOpacity>



      <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center", marginTop: 5}}
                        onPress={() => {navigation.navigate('GraphPage', { name: Var.username })}}>
              <Text style={{color: "white"}}> Progressi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center", marginTop: 5}}
                        onPress={() => {                        
                          navigation.navigate('MapPage', { name:Var.username, pos: Var.mark })}}>
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