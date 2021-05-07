import { WebView } from 'react-native-webview';
import React, { Component, useState} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PasswordInputText from 'react-native-hide-show-password-input';
import Icon  from 'react-native-vector-icons/AntDesign';



const validate_field=(username, password)=>{

  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; //aggiunta claudia
  if (reg.test(username) === false) {
    alert("Inserire un indirizzo email valido");
    return false;
  }

  if(username == ""){
    alert("please fill username")
    return false
  } if(password == ""){
    alert("please fill password")
    return false
  }
  if(username == "" && password == ""){
    alert("Per favore completa tutti i campi")
    return false
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
      }).then(response => {
        console.log(response['status']);
        if(response['status']==200){
          navigation.navigate('HomePage', { name: username })
        }
        else{
          alert("login fallito")
        }
      });

    }catch(e){
      console.log("ERROREEEEEEEEEEE");
      console.log(e);
    }
  
   }


export const LoginScreen = ({ navigation }) => {

  var username = "";
  var password = "";
  let passwordRef = null;  

 
  const [hidePass, setHidePass] = useState(true);

  
  return (
    
     
      <View style={{ width: "100%", height: "100%", justifyContent: "center", alignSelf: "center", alignContent: "center", alignItems: "center"}}>

      <View style={styles.userSection}>  
        <TextInput placeholder={"Inserisci username"}
        onChangeText={(value) => username=value}
        
        style={{height: 42, width: "80%", borderBottomWidth: 1}}
        />
     </View>

       <View style={styles.passSection}>  
        <TextInput placeholder={"Inserisci password"}
         style={styles.input}
        onChangeText={(value) => password = value}
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%"}}
        secureTextEntry={hidePass ? true : false}/>  
        <Icon style={styles.iconStyle} name={state.iconName} size={30} color='#900' onPress={() => {
                  setHidePass(!hidePass);
                  }
        } />
      </View>
   

      <View style={{marginTop: "10%", width: "80%"}}>
          <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                            justifyContent: "center", alignItems: "center", borderRadius: 40,
                            backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                            onPress={() => { if (validate_field(username, password)){
                            api_login_call(username, password,navigation);}}}>
                 <Text style={{color: "white"}}> Login </Text>
          </TouchableOpacity>

      </View>
      <View style={{marginTop: "10%", width: "80%"}}>
          <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                            justifyContent: "center", alignItems: "center", borderRadius: 40,
                            backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                            onPress={() => {navigation.navigate('SignUp', { name: username })}}>
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