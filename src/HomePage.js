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

var stringify;
var myJSON;
var savedBottle;
var name;





export const HomePage = ({ route, navigation}) => {
  name = route.params;
  
  const [dataSearch, setDataSearch]=useState([])
  const [data, setData]=useState([])
  const [isLoading, setisLoading]=useState(false)
  const [pageCurrent, setPageCurrent] = useState(1)
  const isFocused = useIsFocused();
  const [search, setSearch]=useState('');

  useEffect(()=>{
    console.log("Useeffect")
    setisLoading(true)
    getData()
    return () => {

    }

  }, [isFocused])

  getData = async () =>{
    console.log("getData")
    const apiURL ="http://192.168.1.90:8081/api/borracciaprop/"+name["name"]
    fetch(apiURL).then((res)=>res.json()).then((resJson)=>{
     setData(resJson['borracce']);
     setDataSearch(resJson['borracce']);
      setisLoading(false)
    })
  }

  const renderItem = ({item}) => {
    //console.log("renderItem")
    return (
      <View style={style.itemRow}>
        <Text style={{color: "black"}}>Nome: {item.id_borraccia}</Text>
        <Text style={{color: "black"}}>Colore: {item.colore}</Text>
        <Text style={{color: "black"}}>Capacità: {item.capacita}</Text>
        <Text style={{color: "black"}}>Latitudine: {item.lat_borr}</Text>
        <Text style={{color: "black"}}>Longitudine: {item.lon_borr}</Text>
        <Text style={{color: "black"}}>Livello attuale: {item.livello_attuale}</Text>
       

      </View>
    )
  }

  const renderFooter = () =>{
    //console.log("renderFooter")
    //console.log(isFocused)
    return (
      isLoading ? 
    <View style = {style.loader}>
      <ActivityIndicator size="large"/>
    </View> : null
    )
    
  }

  
  const searchFilter=(text)=>{
    console.log(search);
    console.log("Ok");
    console.log(text)
    if(text != ''){
      
      const newData = data.filter((item)=>{
        const itemData = item.id_borraccia ? 
                    item.id_borraccia.toUpperCase(): ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
  } else {
    console.log("ELSE")
    setData(dataSearch);
    console.log(data);
    setSearch(text);
  }
}

  const handleLoadMore = () => {
    setPageCurrent(pageCurrent+1)
    setisLoading(true)
  }

  return (
    <View  style={{height: "95%"}}>
         <TextInput
      style = {style.textInputStyle}
      value = {search}
      placeholder= "search here"
      underlineColorAndroid="transparent"
      onChangeText = {(value)=>searchFilter(value)}
      />
    <View style={{ flex: 1}}>
      
      <FlatList
      style={style.container}
      data = {data}
      renderItem = {renderItem}
      ListFooterComponent = {renderFooter}
      keyExtractor={(item, index) => index.toString()}
      onEndReached = {handleLoadMore}
      onEndReachedThreshold={0.5}
      
      />
     
    
    
      </View>
      <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                        onPress={() => {navigation.navigate('AddBottlePage', { name: name["name"] })}}>
              <Text style={{color: "white"}}> Aggiungi borraccia</Text>
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
                        onPress={() => {navigation.navigate('MapPage', { name: name["name"] })}}>
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