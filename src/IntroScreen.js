import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const IntroScreen = ({ navigation}) => {
    
  const [value, setValue]=useState([''])
  const isFocused = useIsFocused();


  

  useEffect(()=>{
    const retrieveSigniIn = async () => {
      try {
        const valueString = await AsyncStorage.getItem('@SignIn');
        const username = await AsyncStorage.getItem('@username');
        setValue(valueString)
        console.log("SigniIn", valueString)
        if (valueString == null || valueString == "false"){
          console.log("L'utente non è loggato!")
          navigation.navigate(navigation.navigate("Login"));
        } else {
          console.log("L'utente è loggato!")
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
