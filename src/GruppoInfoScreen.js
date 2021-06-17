import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, Image, FlatList, ActivityIndicator } from 'react-native';
import { useIsFocused, useFocusEffect, NavigationContainer } from "@react-navigation/native";
import {creaPartecipante} from './api/api.js'
import { Var } from './api/Var.js';
import Dialog from "react-native-dialog";
import {uri, logout, getSignIn, refresh_Access_Token, getTokenFromStore, exit_app} from './api/api.js'

import { Appbar, Menu, Provider} from 'react-native-paper';
var name;
var numero;

export const GruppoInfoScreen = ({ route, navigation}) => {
    name = route.params['name'];
    const [visible, setVisible] = useState(false);
    const [data, setData]=useState([])
    const [isLoading, setisLoading]=useState(false)
    const [pageCurrent, setPageCurrent] = useState(1)
    const isFocused = useIsFocused();
    const [visibleMenu, setvisibleMenu] = useState(false);

    const openMenu = () => setvisibleMenu(true);

    const closeMenu = () => setvisibleMenu(false);
  
    const backAction = () => {
     navigation.navigate('GruppoPage', { name: Var.username })
    };
    
    useEffect(() => { 
          console.log("Use effect Gruuppo Info Screen", isFocused)
          getData();
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            exit_app
          );
      
          return () => backHandler.remove();



        },[isFocused]
    
      );

      getData = async () =>{
        getSignIn().then((signIn)=>{
        if (signIn == 'true'){
          getTokenFromStore().then((dati) => {
            const apiURL = uri+"getPartecipanti/"+ Var.gruppo_pass + '/'+Var.creatore
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
                    refresh_Access_Token("GruppoInfo", navigation)
                    return false;
                } else{
                  console.log("Impossibile visualizzare i gruppi! Riprova più tardi");
                  return false;
                }
              }).then((resJson)=>{
                    if (resJson){
                      setData(resJson['partecipanti']);
                      Var.numpartecipanti = Object.keys(resJson['partecipanti']).length
                     setisLoading(false)
                    }
                   
                  })
                })
              }
            
            }
            )
          }
      
  
   

    const showDialog = () => {
        setVisible(true);
      };

      const renderItem = ({item}) => {
        console.log("renderItem", item)
        return (

            <View style={{ flex: 1, justifyContent: 'center', width: "100%"}}>
              

            <View style={style.itemRow}>
            <View style={{height: "95%", width: "15%"}}>
                <Image style={style.img} source={{uri: 'https://cdn0.iconfinder.com/data/icons/pinterest-ui-flat/48/Pinterest_UI-18-512.png'}} />
           
            </View>
            <View style={{height: "95%", width: "47%",flexDirection: "row",
                    alignItems: "center"}} >
            <Text style={style.info}> {item.nome}</Text>
            </View>

            <View style={{height: "95%", width: "35%", flexDirection: "row",
                    alignItems: "center"}} >
            <Text style={style.infoChallenge}> {item.totale} ml  </Text>
            {
              item.posizione == 1
              ?
              
              <View style={{height: "95%", width: "30%", marginLeft:"10%"}}>
              <Image style={style.img} source={{uri: 'https://www.pinclipart.com/picdir/middle/6-67022_computer-icons-award-medal-clip-art-winner-trophy.png'}} />
              </View>
              :
              item.posizione == 2
              ?
              <View style={{height: "95%", width: "30%", marginLeft:"10%"}}>
              <Image style={style.img} source={{uri: 'https://www.pinclipart.com/picdir/big/68-680886_image-pose-png-object-multiverse-wiki-fandom-juara.png'}} />
              </View>
              :
              <View style={{ marginLeft:"15%"}}>
              <Text style={style.infoChallenge} >{item.posizione}° </Text>
              </View>
             
            }
            </View>
        </View>
        
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

      const handleLoadMore = () => {
        setPageCurrent(pageCurrent+1)
        setisLoading(true)
      }

      console.log("lunghezzaaaaaaa", Var.numpartecipanti);
      console.log("data", data)

    
    return(

      <View  style={{  height: "100%"}} >
      <View style={{ width: "100%", height:'25%', position: 'absolute', zIndex:100}} >
      <Provider>
      <Appbar.Header  >
      <Appbar.BackAction onPress={backAction} />
      
      <Appbar.Content/>
      <Appbar.Action color="white" icon="trophy" onPress={ ()=> {navigation.navigate("VittoriePage", {gruppo: Var.gruppo_pass+Var.creatore})} }/>
       <Menu
        onDismiss={closeMenu}
        visible={visibleMenu}
        style={{position: 'absolute', zIndex: 100}} 
        anchor={
          <Appbar.Action color="white" icon="dots-vertical" onPress={openMenu}  />
        }>
        <Menu.Item icon='account' title={Var.username} onPress={()=>{navigation.navigate("ProfilePage", {'namePage':"GruppoInfoPage"}); closeMenu()}}/>
       <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
        
    </Appbar.Header>
    </Provider>
    </View>
    <View style={{ flex: 1, width: "95%", height:"100%", marginLeft: 10, marginTop: "15%", zIndex:80}} onTouchStart={() => closeMenu()}>
          
            <Image style={style.img} source={{uri: 'http://blog.merkatus360.com/wp-content/uploads/2020/08/2.png'}} />
          
            <Text style={style.nameGroup}>{Var.gruppo_pass}</Text>
            {
              Object.keys(data).length != 0
              ?
              <Text style={style.subtitle}> Numero partecipanti: {Object.keys(data).length}</Text>
              :
              null
            }
                  
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
    

       <Dialog.Container visible={visible}>
          <Dialog.Title>Aggiungi partecipante</Dialog.Title>
          <Dialog.Button label="Indietro" onPress={()=>{ setVisible(false);}} />
          <Dialog.Button label="Aggiungi" onPress={() => {setVisible(false); creaPartecipante(Var.nomepartecipante,name, Var.creatore, navigation) }} />
          <Dialog.Input placeholder="Inserisci nome partecipante" onChangeText={(value) => {Var.nomepartecipante = value; 

                         console.log("NOME GRUPPO",Var.nomepartecipante )}} />
        </Dialog.Container>
       
       <TouchableOpacity style={style.button} onPress={() => {showDialog()}}>
              <Text style={{color: "white"}}> INVITA </Text>
          </TouchableOpacity>
     
          </View>
          </View>
      

    )
}

const style = StyleSheet.create({
  button:{
    borderWidth: 1, height: 42, width: "80%",
        justifyContent: "center", alignItems: "center", borderRadius: 40,
        backgroundColor: "black", alignSelf: "center", textAlign: "center",
            marginBottom:20, marginTop:10

  },
  img:{
    flex: 1, 
    width: null, 
    height: null, 
    resizeMode: 'contain'
  },
  nameGroup:{
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  subtitle:{
    fontSize: 16,
    color: "black",
    textAlign: "center"
  },
  container:{
    marginTop:10,
  },
  itemRow: {
    marginBottom:10,
    borderRadius: 20, 
    borderColor: "#263472",
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    //alignSelf: "center",
    backgroundColor: "#F6F6F6"
  },
  info:{
      marginRight: 20,
    fontSize: 15,
    fontWeight: "bold",
    color: "black",

  },
  infoChallenge:{
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  }
  });
