import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, Image, FlatList, ActivityIndicator  } from 'react-native';
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import {visualizzaInviti, uri, getTokenFromStore, creaGruppo, logout, getSignIn} from './api/api.js'
import Icon  from 'react-native-vector-icons/FontAwesome';

import { Appbar, Menu, Provider} from 'react-native-paper';
import { Var } from './api/Var.js';
import Dialog from "react-native-dialog";
var name;
export const GruppiScreen = ({ route, navigation}) => {
    name = route.params;
    const [data, setData]=useState([])
    const [isLoading, setisLoading]=useState(false)
    const [visible, setVisible] = useState(false);
    const isFocused = useIsFocused();
    const [visibleMenu, setvisibleMenu] = useState(false);

    const openMenu = () => setvisibleMenu(true);

    const closeMenu = () => setvisibleMenu(false);
  
    const backAction = () => {
     navigation.navigate('HomePage', { name: Var.username })
    };
    const showDialog = () => {
      setVisible(true);
    };


    useEffect(()=>{
      console.log("UseEffect Gruppo page")
      setisLoading(true)
      getData()
     
  
    }, [isFocused])
  
  getData = async () =>{
    getSignIn().then((signIn)=>{
    if (signIn == 'true'){
      getTokenFromStore().then((dati) => {
        const apiURL = uri+"getGruppoByUtente/"+ dati['name']
        fetch(apiURL, {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': dati['Token'],
                'Content-Type': 'application/json'
            }
            }).then((res)=>res.json()).then((resJson)=>{
                console.log("Gruppi----------------------------",resJson)
                setData(resJson['gruppi']);
                //Var.prova = resJson['gruppi']
                //console.log("PROVAAAA", Var.prova)
                setisLoading(false)
                console.log("DATAAAAAAA", data)
              })
            })
          }
        
        }
        )
      }
  

    const renderItem = ({item}) => {
        console.log("renderItem")
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignContent: "center", alignSelf: "center"}}>
          <TouchableOpacity style={style.itemRow} onPress={() => {navigation.navigate('GruppoInfoPage', {'name': item.nome});}}>
          <View style={{ alignItems: "center",width: 150, alignContent: "center", justifyContent: "center", }}>
          <View style={{height: "60%", width: "60%"}}>
            <Image style={style.img} source={{uri: 'https://icons-for-free.com/iconfiles/png/512/person+target+user+icon-1320190816206266307.png'}} />
          </View>
          <Text style={style.info}>{item.nome} </Text>
        </View>
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

      const handleLoadMore = () => {
        setisLoading(true)
      }


    return (



      <View  style={{zIndex: 100}}>
       
      <Provider>
      <Appbar.Header>
      <Appbar.BackAction onPress={backAction} />
      
      <Appbar.Content/>
      <Appbar.Action color="white" icon="bell" onPress={() => {navigation.navigate('NotifichePage')}} > </Appbar.Action>
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
    
    <View  style={{height: "90%", justifyContent: 'center', zIndex:1  }}>
      <View  style={{height: "98%", zIndex:0 }}>
          <View style={{ flex: 1, width: "95%", marginLeft: 10,}}>
   
            <FlatList
                   numColumns={2}
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

        <Dialog.Container visible={visible}>
          <Dialog.Title>Aggiungi nuovo gruppo</Dialog.Title>
          <Dialog.Button label="Indietro" onPress={()=>{ setVisible(false);}} />
          <Dialog.Button label="Aggiungi" onPress={() => {setVisible(false); creaGruppo(Var.nomegruppo).then(()=> {getData();}) }} />
          <Dialog.Input placeholder="Inserisci nome gruppo" onChangeText={(value) => {Var.nomegruppo = value; 
                         console.log("NOME GRUPPO",Var.nomegruppo)}} />
        </Dialog.Container>

          <TouchableOpacity style={style.button} onPress={() => {showDialog()}}>
              <Text style={{color: "white"}}> Aggiungi gruppo </Text>
          </TouchableOpacity>
          </View> 
    </View>   
    </View>
    )

}


const style = StyleSheet.create({
    cointainer:{
      marginTop:20,
      backgroundColor: '#f5fcff',
      flex: 1,
       paddingBottom: 5 
    },
    itemRow: {
      marginBottom:10,
      borderRadius: 100, //100 cerchi
      borderColor: "#D5D5D5",
      backgroundColor: "white",
      height: 150,
      flexDirection: "row",
      alignItems: "center",
      width: 150,
      alignContent: "center",
      textAlign: "center",
      justifyContent: "center", 
      alignSelf: "center",
      marginTop: "10%"
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
    fontSize: 16,
    fontWeight: "bold",
    color: "black",

  },
  img:{
    flex: 1, 
    width: null, 
    height: null, 
    resizeMode: 'contain'
  },
  containerDialog: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button:{
    borderWidth: 1, height: 42, width: "80%", backgroundColor: "red",
        justifyContent: "center", alignItems: "center", borderRadius: 40,
        backgroundColor: "black", alignSelf: "center", textAlign: "center"
  }
  });