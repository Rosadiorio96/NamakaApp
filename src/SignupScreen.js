import { WebView } from 'react-native-webview';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';




const validate_field=(username, password, peso, altezza)=>{

  if(username == "" || password =="" || peso=="" || altezza==""){
    alert("Per favore completa tutti i campi")
    return false
  }
  return true
}

const api_login_call= async (username, password, altezza, peso, navigation)=>{
  console.log(username);
  console.log(password);
    try{
      await fetch('http://192.168.1.90:8081/api/registrazione', {
        method: 'post',
        mode: 'no-cors',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
          altezza: altezza,
          peso: peso
        })
      }).then(response => {
        console.log(response['status']);
        if(response['status']==200){
          navigation.navigate('HomePage', { name: username })
        }
        else{
          alert("registrazione fallita")
        }});

    }catch(e){
      console.log("erroreeee");
      console.log(e);
    }
  
   }



export const SignUpScreen = ({ navigation }) => {

  var username = "";
  var password = "";
  var peso = "";
  var altezza = "";

  return (
      <View style={{ width: "100%", height: "100%", justifyContent: "center", alignSelf: "center", alignContent: "center", alignItems: "center"}}>

        <TextInput placeholder={"Inserisci email"}
        onChangeText={(value) => username=value}
        style={{height: 42, width: "80%", borderBottomWidth: 1}}
        />


        <TextInput placeholder={"Inserisci password"}
        onChangeText={(value) => password = value}
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%"}}
        />

        <TextInput placeholder={"Altezza"}
        onChangeText={(value) => altezza = value}
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%"}}
        />       

        <TextInput placeholder={"Peso"}
        onChangeText={(value) => peso = value}
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%"}}
        />       

      <View style={{marginTop: "10%", width: "80%"}}>
          <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
        justifyContent: "center", alignItems: "center", borderRadius: 40,
        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
        onPress={() => { if (validate_field(username, password)){
            api_login_call(username, password, navigation);}
          }}>

            <Text style={{color: "white"}}> Login </Text>
          </TouchableOpacity>

      </View>
    
    </View>

  );
    
};