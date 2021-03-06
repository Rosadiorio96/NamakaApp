import { View, Text } from "react-native";
import React, { useState, useEffect } from 'react';
import { Var } from "./api/Var";
import { useIsFocused } from "@react-navigation/native";
import {uri, getSignIn, getTokenFromStore, logout, exit_app} from './api/api.js'
import { StyleSheet, BackHandler, TouchableOpacity,Image, FlatList, ActivityIndicator  } from 'react-native';
import Dialog from "react-native-dialog";
import { Appbar, Menu, Provider} from 'react-native-paper';

export const VittorieScreen = ({ route, navigation}) => {

    gruppo = route.params["gruppo"];

    const [dataVittorie, setDataVittorie]=useState([])
    const [dataSconti, setSconti]=useState([])
    const [dataCodice, setCodice]=useState([])
    const isFocused = useIsFocused()
    const [isLoading, setisLoading]=useState(false)
    const [visible, setVisible] = useState(false);
    const [visibleMenu, setvisibleMenu] = useState(false);

    const openMenu = () => setvisibleMenu(true);

    const closeMenu = () => setvisibleMenu(false);
  
    const backAction = () => {
     navigation.navigate('GruppoInfoPage', { name: Var.gruppo_pass })
    };

    const showDialog = () => {
      setVisible(true);
    };

    getData = async () =>{
        getSignIn().then((signIn)=>{
        if (signIn == 'true'){
          getTokenFromStore().then((dati) => {
            const apiURL = uri+"socialApp/vittorie/"+ Var.username + "/" + gruppo
            fetch(apiURL, {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    
                    'Content-Type': 'application/json'
                }
                }).then((res)=>res.json()).then((resJson)=>{
                    setDataVittorie(resJson['Listavittorie']);
                    setSconti(resJson['numeroSconti'])
                    
                  })
                })
              }
            
            }
            )
          }
      
  
    getCodice = async () =>{
      getSignIn().then((signIn)=>{
      if (signIn == 'true'){
        getTokenFromStore().then((dataV) => {
          const apiURL = uri+"socialApp/sconti/"+ Var.username
          fetch(apiURL, {
              method: 'GET',
              withCredentials: true,
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': dataV['Token'],
              }
              }).then((res)=>res.json()).then((resJson)=>{
                  setCodice(resJson['ListaSconti'])
                })
              })
            }
          }
          )
        }


    useEffect(() => { 
        console.log("Use effect Vittorie screen", isFocused)
        getData();
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          exit_app
        );
    
        return () => backHandler.remove();
    },[isFocused]);


    const renderItem = ({item}) => {
      console.log("renderItem-------------------", item)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: "center", alignSelf: "center"}}>
        <TouchableOpacity style={styles.itemRow} disabled={true} >
        <View style={{ alignItems: "center",width: 150, alignContent: "center", justifyContent: "center", }}>
        <View style={{height: "60%", width: "60%"}}>
          <Image style={styles.img} source={{uri: 'https://www.iconpacks.net/icons/1/free-winner-icon-488-thumb.png'}} />
        </View>
        <Text style={styles.info}>{item.giorno} </Text>
      </View>
    </TouchableOpacity>
  </View>   
          )
    }
 
    const renderFooter = () =>{
      return (
        isLoading ? 
      <View style = {styles.loader}>
        <ActivityIndicator size="large"/>
      </View> : null
      )
    }

    const handleLoadMore = () => {
      setisLoading(true)
    }


    var lista_codici = [];
    for(let i = 0; i< dataCodice.length; i++){
      lista_codici.push(
        <Text key = {i} style={{fontSize: 18, textAlign:'center', fontWeight:'bold'}}>{dataCodice[i].codice} dal valore di {dataCodice[i].valore}%</Text>
      );
    }


    
    return(
       <View  style={{  height: "100%"}} >
        <View style={{ width: "100%", height:'14%', position: 'absolute', zIndex:100}} >
      <Provider>
      <Appbar.Header>
      <Appbar.BackAction onPress={backAction} />
      
      <Appbar.Content/>
        <Menu
        style={{ position:'absolute', zIndex:300}}
        onDismiss={closeMenu}
        visible={visibleMenu}
        anchor={
          <Appbar.Action color="white" icon="dots-vertical" onPress={openMenu} />
        }>
        
        <Menu.Item icon='account' title={Var.username} onPress={()=>{navigation.navigate("ProfilePage", {'namePage':"VittoriePage"}); closeMenu()}}/>
       <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
        
    </Appbar.Header>
    </Provider>
    </View>
    
    <View style={{ flex: 1, width: "95%", height:"100%", marginLeft: 10, marginTop: "15%", zIndex:99}} onTouchStart={() => closeMenu()}>
            <Text style={styles.textGraph}> LE TUE VITTORIE</Text>
            <FlatList
              numColumns={2}
              data = {dataVittorie}
              renderItem = {renderItem}
              ListFooterComponent = {renderFooter}
              keyExtractor={(item, index) => index.toString()}
              onEndReached = {handleLoadMore}
              onEndReachedThreshold={0.5}
              extraData={dataVittorie}
            />
            </View>

        {
          dataSconti > 0
          ?
          <TouchableOpacity style={styles.button} onPress={() => {showDialog(); getCodice();}}>
            <Text style={{color: "white"}}> Richiedi codice sconto </Text>
          </TouchableOpacity>
          :
          null
        }


        <Dialog.Container style={{height:"10%"}} visible={visible}>
          <Dialog.Title style={{textAlign:'center'}}>Complimenti!</Dialog.Title>
          {
            lista_codici.length == 1
            ?
            <Dialog.Title style={{textAlign:'center'}}> Il tuo codice sconto ??</Dialog.Title>
            :
            <Dialog.Title style={{textAlign:'center'}}> I tuoi codici sconto sono </Dialog.Title>
          }
          <View>{lista_codici}</View>
          <Dialog.Button label="Ok" onPress={() => {setVisible(false); }} />
        </Dialog.Container>
      </View>
  )


}

const styles = StyleSheet.create({
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
button:{
  borderWidth: 1, height: 42, width: "80%", marginBottom:"8%",
      justifyContent: "center", alignItems: "center", borderRadius: 40,
      backgroundColor: "black", alignSelf: "center", textAlign: "center",  marginBottom:20, marginTop:10
},
textGraph:{
  fontSize: 18,
  fontWeight: "bold",
  textAlign: 'center',
  marginTop: "5%"
},
});