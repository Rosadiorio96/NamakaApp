import React, { Component,useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList,  RefreshControl, ActivityIndicator } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import {check_token, uri} from './api/api.js'
import { Var } from './api/Var.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';

export const IntroScreen = ({ navigation}) => {
    
  const [value, setValue]=useState([''])
  const isFocused = useIsFocused();


  

  useEffect(()=>{
    const retrieveSigniIn = async () => {
      try {
        const valueString = await AsyncStorage.getItem('@SignIn');
        const username = await AsyncStorage.getItem('@username');
        setValue(valueString)
        //const value = JSON.parse(valueString);
        console.log("SigniIn", valueString)
        if (valueString == null || valueString == "false"){
          console.log("L'utente non è loggato!")
          navigation.navigate(navigation.navigate("Login"));
        } else {
          console.log("L'utente è loggato!")
          console.log("Nome", username)
          navigation.navigate('HomePage', { name: String(username) })
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (value != null){
      retrieveSigniIn();
    }
   
}, [isFocused])

  





  return (
    <View> 
        
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