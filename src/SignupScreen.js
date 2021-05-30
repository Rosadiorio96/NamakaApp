import React, { Component, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, SafeAreaView, ScrollView } from 'react-native';
import Icon  from 'react-native-vector-icons/FontAwesome';
import { Var } from './api/Var.js';
import { api_signup_call } from './api/api';



const validate_field=(username, password, peso, altezza)=>{

  if(username == "" || password =="" || peso=="" || altezza==""){
    alert("Per favore completa tutti i campi")
    return false
  }

  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; //aggiunta claudia
  if (reg.test(username) === false) {
    alert("Inserire un indirizzo email valido");
    return false;
  }

  if(isNaN(peso) || isNaN(altezza)){
    alert("Il peso o l'altezza non è un numero");
    return false;
  }
  
  return true
}





export const SignUpScreen = ({ navigation }) => {

  const [hidePass, setHidePass] = useState(true);

  const [stato, setName] = useState(false);

  const setNameIcon = () => {
    setName(!stato);
  }

 

  return (
     
      <View style={{ width: "100%", height: "100%", justifyContent: "center", alignSelf: "center", alignContent: "center", alignItems: "center"}}>

     <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}>
     <TextInput placeholder={"Inserisci email"}
        onChangeText={(value) => Var.username=value}
        style={{height: 42, width: "80%", borderBottomWidth: 1, fontFamily:'monospace'}}
        />


      <View style={styles.passSection}>  
        <TextInput placeholder={"Inserisci password"}
        secureTextEntry={hidePass ? true : false}
        style={styles.input} 
        onChangeText={(value) => Var.password = value}
        />  
 
        <Icon style={styles.iconStyle} name={stato ? 'eye' : 'eye-slash'} size={30} color='black' onPress={() => {
                  setHidePass(!hidePass);
                  setNameIcon()
                  }}
         />

      </View>

        <TextInput placeholder={"Inserisci altezza in cm"}
        onChangeText={(value) => Var.altezza = value}
        keyboardType='numeric'
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%", fontFamily:'monospace'}}
        />       

        <TextInput placeholder={"Inserisci peso in kg"}
        onChangeText={(value) => Var.peso = value}
        keyboardType='numeric'
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%", fontFamily:'monospace'}}
        />       

      <View style={{marginTop: "10%", width: "80%"}}>
          <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
        justifyContent: "center", alignItems: "center", borderRadius: 40,
        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
        onPress={() => { if (validate_field(Var.username, Var.password, Var.peso, Var.altezza)){
          api_signup_call(Var.username, Var.password, Var.altezza, Var.peso, navigation);}
          }}>

            <Text style={{color: "white"}}> Login </Text>
          </TouchableOpacity>

      </View>
     </ScrollView>
  

        
    
      </View>


  );
    
};

const styles = StyleSheet.create({
  passSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
},
userSection: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: 5,
  paddingRight: 25,
},
iconStyle: {
    padding: 10,
    paddingTop: 30,
},
input: {
    paddingTop: 10,
    paddingRight: 50,
    paddingBottom: 10,
    color: '#424242',
    fontFamily:'monospace',
    height: 42,
    width: "80%", 
    borderBottomWidth: 1, 
    marginTop: "5%"
},
container: {
  flex: 1,
},
scrollView: {
  backgroundColor: 'pink',
  marginHorizontal: 20,
},
text: {
  fontSize: 42,
},
});