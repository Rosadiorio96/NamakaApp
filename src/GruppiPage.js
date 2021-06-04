import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, Image, FlatList, ActivityIndicator  } from 'react-native';
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import {visualizzaInviti, uri, getTokenFromStore} from './api/api.js'
import { Var } from './api/Var.js';

export const GruppiScreen = ({ route, navigation}) => {
    const [data, setData]=useState([])
    const [isLoading, setisLoading]=useState(false)
      
    useFocusEffect(() => {
        getTokenFromStore().then((data) => {
            const apiURL = uri+"getGruppoByUtente/"+ data['name']
            fetch(apiURL, {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': data['Token'],
                    'Content-Type': 'application/json'
                }
                }).then((res)=>res.json()).then((resJson)=>{
                    console.log("Gruppi----------------------------",resJson)
                    setData(resJson['gruppi']);
                    setisLoading(false)
               })
        }) 
    });




    const renderItem = ({item}) => {
        console.log("renderItem")
        return (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={style.info}> Gruppo: {item.nome} </Text>
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
    return (<View style={{ flex: 1, width: "95%", marginLeft: 10}}>
      
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
   
    </View>)

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