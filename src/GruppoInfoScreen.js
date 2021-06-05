import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, Image, FlatList, ActivityIndicator  } from 'react-native';
import { useIsFocused, useFocusEffect, NavigationContainer } from "@react-navigation/native";
import {creaPartecipante} from './api/api.js'
import { Var } from './api/Var.js';
import Dialog from "react-native-dialog";
import {uri} from './api/api.js'

var name;

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
            setisLoading(false)
        })
    
    
      }

    const showDialog = () => {
        setVisible(true);
      };

      const renderItem = ({item}) => {
        console.log("renderItem")
        return (
          <View style={{ flex: 1, justifyContent: 'center' }}>
    
           <Text style={style.info}> Nome: {item.nome}</Text>
          
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
    
    return(
        <View><Text> Nome gruppo: {name}</Text>
        <Text> Partecipanti:</Text>
       <Text> Creatore: {Var.username}</Text>
       <View>
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
    borderWidth: 1, height: 42, width: "80%", backgroundColor: "red",
        justifyContent: "center", alignItems: "center", borderRadius: 40,
        backgroundColor: "black", alignSelf: "center", textAlign: "center"
  }
  });
