import { View, Text } from "react-native";
import React, { useState, useEffect } from 'react';
import { Var } from "./api/Var";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import {uri, getSignIn, getTokenFromStore} from './api/api.js'
export const VittorieScreen = ({ route, navigation}) => {

    gruppo = route.params["gruppo"];
    const [dataVittorie, setDataVittorie]=useState([])
    const [dataSconti, setSconti]=useState([])
    const isFocused = useIsFocused()

    getData = async () =>{
        getSignIn().then((signIn)=>{
        if (signIn == 'true'){
          getTokenFromStore().then((dati) => {
            const apiURL = uri+"vittorie/"+ Var.username + "/" + gruppo
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
                    console.log(resJson['Listavittorie'])
                    console.log(resJson['numeroSconti'])
                    
                  })
                })
              }
            
            }
            )
          }
      
  
  


    useEffect(() => { 
        console.log("Use effect Vittorie screen", isFocused)
        getData();
    },[isFocused]);



 



    return(<View><Text>
        HELLO
        </Text>
    </View>)


}