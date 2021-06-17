import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, Image  } from 'react-native';
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { Var } from './api/Var.js';
import BackgroundTimer from 'react-native-background-timer';
import {uri, getSignIn, logout, api_modify_position, exit_app} from './api/api.js'
import { Appbar, Menu, Provider } from 'react-native-paper'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

var stringify;
var myJSON;
var savedBottle;
var name;
var navigation2;


const position_user = async ()=>{
  var payload = {}
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition((position) => {
          payload['latitudine'] =  position["coords"]["latitude"];
          payload["longitudine"] = position["coords"]["longitude"];
          Var.lat_user = position["coords"]["latitude"];
          Var.lon_user = position["coords"]["longitude"];
          console.log("AAAAAAAA", Var.lat_user);
          console.log("BBBBBBBB", Var.lon_user);
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


}

const find_position_user = async ()=>{
  getSignIn().then((signIn)=>{
    console.log("Signin", signIn)
    if (signIn == 'true'){
      position_user()
   } else {
    console.log("Errore find Position");
   }
  })
  }


  const timer = BackgroundTimer.runBackgroundTimer(() => { 
  
    find_position_user();
  
},300000);




export const HomePage = ({ route, navigation}) => {
  Var.username = route.params["name"];
  navigation2 = navigation;

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const isFocused = useIsFocused();

  const backAction = () => {
    console.log("Back 2")
    Alert.alert("Attenzione!", "Sei sicuro di voler uscire?", [
      {
        text: "Indietro",
        onPress: () => null,
        style: "cancel"
      },
      { text: "Si", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  useFocusEffect(() => {
    console.log("Var", Var.username)
    if(Var.username != null){
      console.log("Use effect HomePage", isFocused)
      find_position_user();
    }
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();

  });


  
 
 

  return (
    <View>
      <Provider>
      <Appbar.Header>
      
      <Appbar.BackAction onPress={backAction} />
      <Appbar.Content/>
        <Menu
        onDismiss={closeMenu}
        visible={visible}
        anchor={
          <Appbar.Action color="white" icon="dots-vertical" onPress={openMenu} />
        }>
      <Menu.Item icon='account' title={Var.username} onPress={()=>{navigation.navigate("ProfilePage", {'namePage':"HomePage"}); closeMenu()}}/>
       <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
    </Appbar.Header>
    </Provider>
    <View  style={{height: "90%", justifyContent: 'center' }}>
    <View style={{flexDirection: "row", width: "90%", height: "30%", marginLeft: 12}}>
    <TouchableOpacity style={{borderWidth: 1, height: "100%", width: "50%",
                        justifyContent: "center", alignItems: "center", borderRadius: 7, borderColor: "#D5D5D5",
                        backgroundColor: "white", alignSelf: "center", textAlign: "center", marginTop: 5}}
                        onPress={() =>  {navigation.navigate('BorraccePage', { name: Var.username }); closeMenu()}}>
                          <View style={{height: "60%", width: "60%"}}>
                            <Image style={style.img} source={{uri: 'https://image.flaticon.com/icons/png/512/217/217655.png'}} />
                          </View>
              <Text style={{color: "black", marginTop: 10, fontSize: 18, fontWeight: "bold"}}> Le tue borracce</Text>
      </TouchableOpacity>

      
  
      <TouchableOpacity style={{borderWidth: 1, height: "100%", width: "50%", marginLeft: 10, 
                        justifyContent: "center", alignItems: "center", borderRadius: 7, borderColor: "#D5D5D5",
                        backgroundColor: "white", alignSelf: "center", textAlign: "center", marginTop: 5}}
                        onPress={() => {                        
                          navigation.navigate('MapPage', { name: Var.username, pos: Var.mark }); closeMenu()}}>
                          <View style={{height: "60%", width: "60%"}}>
                            <Image style={style.img} source={{uri: 'https://cdn.icon-icons.com/icons2/426/PNG/512/Map_1135px_1195280_42272.png'}} />
                          </View>
              <Text style={{color: "black", marginTop: 10, fontSize: 18, fontWeight: "bold"}}> Mappa</Text>
      </TouchableOpacity>
    </View>

    <View style={{flexDirection: "row", width: "90%", height: "30%", marginLeft: 12, marginTop: 30}}>
      <TouchableOpacity style={{borderWidth: 1, height: "100%", width: "50%",
                        justifyContent: "center", alignItems: "center", borderRadius: 7, borderColor: "#D5D5D5",
                        backgroundColor: "white", alignSelf: "center", textAlign: "center", marginTop: 5}}
                        onPress={() => {navigation.navigate('GraphPage', { name: Var.username }); closeMenu()}}>
                          <View style={{height: "60%", width: "60%"}}>
                            <Image style={style.img} source={{uri: 'https://becomebusinessowners.com/wp-content/uploads/2021/03/graph-increase-png-3-Transparent-Images.png'}} />
                          </View>
              <Text style={{color: "black", marginTop: 10, fontSize: 18, fontWeight: "bold"}}> Progressi</Text>
      </TouchableOpacity>

  
      <TouchableOpacity style={{borderWidth: 1, height: "100%", width: "50%", marginLeft: 10,
                        justifyContent: "center", alignItems: "center", borderRadius: 7, borderColor: "#D5D5D5",
                        backgroundColor: "white", alignSelf: "center", textAlign: "center", marginTop: 5}}
                        onPress={() => {navigation.navigate('GruppoPage', { name: Var.username }); closeMenu()}}>
                          <View style={{height: "60%", width: "60%"}}>
                            <Image style={style.img} source={{uri: 'https://meatloaf-oifc.com/img/other/72/collection-group-work-cliparts-24.jpg'}} />
                          </View>
              <Text style={{color: "black", marginTop: 10, fontSize: 18, fontWeight: "bold"}}> Social </Text>
      </TouchableOpacity>
    </View>
  
    </View>
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
},
img:{
  flex: 1, 
  width: null, 
  height: null, 
  resizeMode: 'contain'
}

});