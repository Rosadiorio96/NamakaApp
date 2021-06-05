import React, { Component,useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList, BackHandler, RefreshControl, ActivityIndicator, Image, Alert } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import {uri} from './api/api.js'
import { api_remove_bottle } from './api/api';
import { Var } from './api/Var.js';
var name;

export const BorracceScreen = ({ route, navigation }) => {
    name = route.params;
  
  const [dataSearch, setDataSearch]=useState([])
  const [data, setData]=useState([])
  const [isLoading, setisLoading]=useState(false)
  const [pageCurrent, setPageCurrent] = useState(1)
  const isFocused = useIsFocused();
  const [search, setSearch]=useState('');


  useEffect(()=>{
    console.log("UseEffect Borracce Screen")
    setisLoading(true)
    getData()
   

  }, [isFocused])

  if(name["name"]!= undefined){
    getData = async () =>{
      console.log("getData")
      const apiURL = uri+"borracciaprop/"+name["name"]
      fetch(apiURL).then((res)=>res.json()).then((resJson)=>{
       setData(resJson['borracce']);
       setDataSearch(resJson['borracce']);
        setisLoading(false)
      })
  
  
    }
  }

  deleteItemById = (id) =>{
    const filteredData = data.filter(item => item.id_borraccia !== id['id_borraccia']);
    setData(filteredData)
  }

  const renderItem = ({item}) => {
    console.log("renderItem")
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>

          <TouchableOpacity style={style.itemRow} onPress={ () => {

            Alert.alert( "Rimuovi borraccia", "Sicuro di voler rimuovere?",
              [ { text: "Indietro", onPress: () => {},
                  style: "cancel",
                },
                { text: "Rimuovi",
                  onPress: () => { api_remove_bottle(item,name["name"], navigation); 
                    deleteItemById(item)
                  },
                  style: "cancel", }, ],);         
        }} 
        >
          <View>
        <Text style={style.info}> Nome: {item.id_borraccia}</Text>
        <Text style={style.info}> Colore: {item.colore}</Text>
        <Text style={style.info}> Capacità: {item.capacita} ml</Text>
        </View>
        {
          item.colore == 'rosso'
          ?
          <View style={{height: "95%", width: "95%"}}>
          <Image style={style.img} source={{uri: 'https://www.costile.it/wp-content/uploads/2020/03/Borraccia-rossa-neon-500ml.png'}} />
          </View>
          :
          item.colore == 'verde'
          ?
          <View style={{height: "95%", width: "95%"}}>
          <Image style={style.img} source={{uri: 'https://www.elobaby.net/pub/media/catalog/product/cache/61cb022fefe44ea9a02a65c730c313fb/n/e/neon_verde.png'}} />
          </View>
          :
          item.colore == 'blu'
          ?
          <View style={{height: "95%", width: "95%"}}>
          <Image style={style.img} source={{uri: 'https://www.datocms-assets.com/11645/1559568936-v2-neon-blue-500ml.png?q=80&auto=format&dpr=1&w=206&fit=crop'}} />
          </View>
          :
          <View style={{height: "95%", width: "95%"}}>
          <Image style={style.img} source={{uri: 'https://www.datocms-assets.com/11645/1559568936-v2-neon-blue-500ml.png?q=80&auto=format&dpr=1&w=206&fit=crop'}} />
          </View>
        }
      </TouchableOpacity>
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
      placeholder= "Cerca"
      underlineColorAndroid="transparent"
      onChangeText = {(value)=>searchFilter(value)}
      />
    <View style={{ flex: 1, width: "95%", marginLeft: 10}}>
      
      <FlatList
      style={style.container}
      data = {data}
      renderItem = {renderItem}
      ListFooterComponent = {renderFooter}
      keyExtractor={(item, index) => index.toString()}
      onEndReached = {handleLoadMore}
      onEndReachedThreshold={0.5}
      extraData={data}
      
      />
     
      </View>
      <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%", marginTop: "5%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                        onPress={() => {navigation.navigate('AddBottlePage', { name: name["name"] })}}>
              <Text style={{color: "white"}}> Aggiungi borraccia</Text>
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
      borderRadius: 5,
      marginBottom:10,
      borderRadius: 7, 
      borderColor: "#D5D5D5",
      backgroundColor: "white",
      height: 100,
      flexDirection: "row",
      alignItems: "center",
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
    backgroundColor: 'white',
    fontSize: 18,
    
  },
  info:{
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  },
  img:{
    flex: 1, 
    width: null, 
    height: null, 
    resizeMode: 'contain'
  }
  
  });