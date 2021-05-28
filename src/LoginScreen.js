import React, { useState, setState,  useRef, useEffect} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import Icon  from 'react-native-vector-icons/FontAwesome';
import { Var } from './Var.js';
import AsyncStorage from '@react-native-async-storage/async-storage';


const validate_field=(username, password)=>{

  if(username == "" && password == ""){
    alert("Per favore completa tutti i campi")
    return false
  }
  if(username == ""){
    alert("Per favore inserisci l'email")
    return false
  } if(password == ""){
    alert("Per favore inserisci la password")
    return false
  }
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; //aggiunta claudia
  if (reg.test(username) === false) {
    alert("Inserire un indirizzo email valido");
    return false;
  }

  return true
}

const api_login_call= async (username, password, navigation)=>{
  console.log(username);
  console.log(password);
    try{
      await fetch('http://192.168.1.90:8081/api/login', {
        method: 'post',
        mode: 'no-cors',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,

        })
      }).then((res)=>res.json()).then((resJson)=>{
        console.log(typeof(resJson["access"]));

        if(resJson.hasOwnProperty('access')){
          try {
            AsyncStorage.setItem('@storage_tokenAccess', resJson["access"]);
            AsyncStorage.setItem('@storage_tokenRefresh', resJson["refresh"]);
          } catch (e) {
            console.log("Errore salvataggio!")
          }
          navigation.navigate('HomePage', { name: username })
        } else {
          alert("Errore Login");
        }
        
      });

    }catch(e){
      alert("Errore Login");
    }
  
   }

export const LoginScreen = ({ navigation }) => {

 
  const [hidePass, setHidePass] = useState(true);
  
  const [stato, setName] = useState(false);

  const setNameIcon = () => {
    setName(!stato);
  }


  return (
    
     
      <View style={{ width: "100%", height: "100%", justifyContent: "center", alignSelf: "center", alignContent: "center", alignItems: "center"}}>

      <View style={styles.userSection}>  
        <TextInput placeholder={"Inserisci email"}
        onChangeText={(value) => Var.username=value}
        
        style={{height: 42, width: "80%", borderBottomWidth: 1, fontFamily:'monospace'}}
        />
     </View>

       <View style={styles.passSection}>  
        <TextInput placeholder={"Inserisci password"}
         style={styles.input}
        onChangeText={(value) => Var.password = value}
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%"}}
        secureTextEntry={hidePass ? true : false}/>  
 
        <Icon style={styles.iconStyle} name={stato ? 'eye' : 'eye-slash'} size={30} color='black' onPress={() => {
                  console.log("uuuuuuuuuuu", Var.username)
                  setHidePass(!hidePass);
                  setNameIcon()
                  }}
         />

      </View>
   

      <View style={{marginTop: "10%", width: "80%"}}>
          <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                            justifyContent: "center", alignItems: "center", borderRadius: 40,
                            backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                            onPress={() => { if (validate_field(Var.username, Var.password)){
                            api_login_call(Var.username, Var.password,navigation);}}}>
                 <Text style={{color: "white"}}> Login </Text>
          </TouchableOpacity>

      </View>
      <View style={{marginTop: "10%", width: "80%"}}>
          <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                            justifyContent: "center", alignItems: "center", borderRadius: 40,
                            backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                            onPress={() => {navigation.navigate('SignUp', { name: Var.username })}}>
                  <Text style={{color: "white"}}> Registrati</Text>
          </TouchableOpacity>

      </View>

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
    flex: 1,
    paddingTop: 10,
    paddingRight: 50,
    paddingBottom: 10,
    paddingLeft: 30,
    backgroundColor: '#fff',
    color: '#424242',
},

});