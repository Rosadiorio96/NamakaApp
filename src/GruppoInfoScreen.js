import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, Image, FlatList, ActivityIndicator  } from 'react-native';
import { useIsFocused, useFocusEffect, NavigationContainer } from "@react-navigation/native";
import {creaPartecipante} from './api/api.js'
import { Var } from './api/Var.js';
import Dialog from "react-native-dialog";
import {uri} from './api/api.js'

var name;
var numero;

export const GruppoInfoScreen = ({ route, navigation}) => {
    name = route.params['name'];
    const [visible, setVisible] = useState(false);
    const [data, setData]=useState([])
    const [isLoading, setisLoading]=useState(false)
    const [pageCurrent, setPageCurrent] = useState(1)
    const isFocused = useIsFocused();

    

    useEffect(() => { 
          console.log("Use effect Gruuppo Info Screen", isFocused)
          getData();
        },[isFocused]
    
      );


    getData = async () =>{
        console.log("getData")
        const apiURL = uri+"getPartecipanti/"+name
        fetch(apiURL).then((res)=>res.json()).then((resJson)=>{
         setData(resJson['partecipanti']);
         console.log("partecipanti", resJson['partecipanti']);
         Var.numpartecipanti = Object.keys(resJson['partecipanti']).length
         console.log("lunghezza", Var.numpartecipanti);
            setisLoading(false)
        })
    
    
      }

    const showDialog = () => {
        setVisible(true);
      };

      const renderItem = ({item}) => {
        console.log("renderItem", item)
        return (

            <View style={{ flex: 1, justifyContent: 'center', width: "100%"}}>

            <TouchableOpacity style={style.itemRow}>
            <View style={{height: "95%", width: "26%"}}>
                <Image style={style.img} source={{uri: 'https://cdn0.iconfinder.com/data/icons/pinterest-ui-flat/48/Pinterest_UI-18-512.png'}} />
            </View>
            
            <Text style={style.info}> {item.nome}</Text>
            <Text style={style.info}> {item.totale}</Text>
            <Text style={style.info}> {item.posizione}</Text>
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

      const handleLoadMore = () => {
        setPageCurrent(pageCurrent+1)
        setisLoading(true)
      }

      console.log("lunghezzaaaaaaa", Var.numpartecipanti);
      console.log("data", data)

    
    return(
        <View  style={{height: "98%"}}>
        <View style={{height: "30%", width: "100%"}}>
            <Image style={style.img} source={{uri: 'http://blog.merkatus360.com/wp-content/uploads/2020/08/2.png'}} />
          </View>
            <Text style={style.nameGroup}>{name}</Text>
            <Text style={style.subtitle}> Numero partecipanti: {Object.keys(data).length}</Text>
            {/*<Text> Creatore: {Var.username}</Text>*/}
                  
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
          <Dialog.Button label="Aggiungi" onPress={() => {setVisible(false); creaPartecipante(Var.nomepartecipante,name) }} />
          <Dialog.Input placeholder="Inserisci nome partecipante" onChangeText={(value) => {Var.nomepartecipante = value; 

                         console.log("NOME GRUPPO",Var.nomepartecipante )}} />
        </Dialog.Container>
       
       <TouchableOpacity style={style.button} onPress={() => {showDialog()}}>
              <Text style={{color: "white"}}> INVITA </Text>
          </TouchableOpacity>
     
      
      
      </View>

    )
}

const style = StyleSheet.create({
  button:{
    borderWidth: 1, height: 42, width: "80%",
        justifyContent: "center", alignItems: "center", borderRadius: 40,
        backgroundColor: "black", alignSelf: "center", textAlign: "center",
            position: 'absolute',
    bottom:0,

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
    textAlign: "center"
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
    fontSize: 16,
    fontWeight: "bold",
    color: "black",

  },
  });
