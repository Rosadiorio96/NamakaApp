import React, { Component,useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList, BackHandler, RefreshControl, ActivityIndicator, Image, Alert } from 'react-native';
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {uri, api_remove_bottle, logout, getSignIn, getTokenFromStore, refresh_Access_Token} from './api/api.js'
import { Appbar, Menu, Provider} from 'react-native-paper'; 
import { SearchBar } from 'react-native-elements';
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
  const [visible, setVisible] = useState(false);
  const [visibleSearch, setVisibleSearch] = useState(0);

  const openMenu = () => {setVisible(true), dontshosearch()};

  const closeMenu = () => setVisible(false);
  
  const showSearch = () => setVisibleSearch(1);

  const dontshosearch = () => setVisibleSearch(0);
  
  const backAction = () => {
    console.log("back")
    navigation.navigate("HomePage", name = Var.username)
  };
  

  useEffect(()=>{
    console.log("UseEffect Borracce Screen")
    setisLoading(true)
    getData()

    const backAction2 = () => {
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
    

    const backHandler_borracce = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction2
    );

    return () => backHandler_borracce.remove();
   

  }, [isFocused])


  getData = async () =>{
    getSignIn().then((signIn)=>{
    if (signIn == 'true'){
      getTokenFromStore().then((dati) => {
        const apiURL = uri+"borracciaprop/"+ dati['name']
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
                console.log("-- L'utente è loggatto! --");
                return res.json();
              } else if (res['status'] == 401){
                  refresh_Access_Token("Borracce", navigation)
                  return false;
              } else{
                  console.log("Impossibile visualizzare le borracce! Riprova più tardi");
                  return false;
              }
              }).then((resJson)=>{
                if(resJson){
                setData(resJson['borracce']);
                setDataSearch(resJson['borracce']);
                setisLoading(false)
                }
                
              })
            })
          }
        }
        )
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

    <View  style={{  height: "100%"}} >
        <View style={{ width: "100%", height:'14%', position: 'absolute', zIndex:100}} >
    <Provider>
    <Appbar.Header>
   
    <Appbar.BackAction onPress={backAction} />
    <Appbar.Content/>
    
    <TouchableOpacity style={{ width: "50%"}}>
    <TextInput
      style = {style.textInputStyle}
      value = {search}
      onChangeText = {(value)=>searchFilter(value)}
      opacity={visibleSearch}
      />
    </TouchableOpacity>
    <Appbar.Action color="white" icon="magnify" onPress={()=>{ 
      if (visibleSearch == 0){
        showSearch()
      } else {
        dontshosearch()
        setSearch("")
      } }} />
      <Menu
      onDismiss={closeMenu}
      visible={visible}
      anchor={
        <Appbar.Action color="white" icon="dots-vertical" onPress={openMenu} />
      }>
   <Menu.Item icon='account' title={Var.username}/>
     <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
      </Menu>

  </Appbar.Header>
  </Provider>
  </View>
  <View style={{ flex: 1, width: "95%", height:"100%", marginLeft: 10, marginTop: "15%", zIndex:99}} onTouchStart={() => {closeMenu(), dontshosearch()}}>
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
      <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center",  marginBottom:20, marginTop:10}}
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
    width: "100%",
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