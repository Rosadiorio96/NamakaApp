import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert,BackHandler, Image } from 'react-native';
import Icon  from 'react-native-vector-icons/FontAwesome';
import { Var } from './api/Var.js';
import { api_signup_call, exit_app } from './api/api';
import { useIsFocused , useFocusEffect} from "@react-navigation/native";
import { Appbar, Provider} from 'react-native-paper'; 



const validate_field=(username, password, peso, altezza)=>{

  if((username == "" || username==undefined) || (password =="" || password==undefined) || 
      (peso==""|| peso == undefined) || (altezza=="" || altezza==undefined)){
    Alert.alert("Attenzione","Per favore completa tutti i campi")
    return false
  }

  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; //aggiunta claudia
  if (reg.test(username) === false) {
    Alert.alert("Attenzione","Inserire un indirizzo email valido");
    return false;
  }

  if(isNaN(peso) || isNaN(altezza) || peso<30 || altezza<0 ){
    Alert.alert("Attenzione","Inserire correttamente altezza e peso");
    return false;
  }
  
  return true
}





export const SignUpScreen = ({ navigation }) => {

  const [hidePass, setHidePass] = useState(true);

  const [stato, setName] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [altezza, setAltezza] = useState("");
  const [peso, setPeso] = useState("");

  const isFocused = useIsFocused();

  const setNameIcon = () => {
    setName(!stato);
  }
  
  const backAction = () => {
    Var.username="";
    Var.password="";
    navigation.navigate("Login")
  };

  useFocusEffect(() => {
    console.log("Use effect signup ", isFocused)


    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      exit_app
    );
    return () => backHandler.remove();

  });
 

  return (
     
    <View  style={{  height: "100%"}} >
    <View style={{ width: "100%", height:'14%', position: 'absolute', zIndex:100}} >
  <Provider>
  <Appbar.Header>
  <Appbar.BackAction onPress={backAction} />
  
  <Appbar.Content/>
  
    
</Appbar.Header>
</Provider>
</View>

     <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}>
     <View style={{height: "20%", width: "40%"}}>
              <Image style={styles.img} source={require('./img/logo.png')} />
            </View>
     <TextInput placeholder={"Inserisci email"}
        value = {username}
        onChangeText={(value) => {
          setUsername(value)
          Var.username=value}}
        style={{height: 42, width: "80%", borderBottomWidth: 1, fontFamily:'monospace'}}
         
        />


      <View style={styles.passSection}>  
        <TextInput placeholder={"Inserisci password"}
        value = {password}
        secureTextEntry={hidePass ? true : false}
        style={styles.input} 
        onChangeText={(value) => setPassword(value)}
        />  
 
        <Icon style={styles.iconStyle} name={stato ? 'eye' : 'eye-slash'} size={30} color='black' onPress={() => {
                  setHidePass(!hidePass);
                  setNameIcon()
                  }}
         />

      </View>
        
        <TextInput placeholder={"Inserisci altezza in cm"}
        value = {altezza}
        onChangeText={(value) => setAltezza(value)}
        keyboardType='numeric'
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%", fontFamily:'monospace'}}
        />       

        <TextInput placeholder={"Inserisci peso in kg"}
         value =  {peso}
        onChangeText={(value) => setPeso(value)}
        keyboardType='numeric'
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%", fontFamily:'monospace'}}
        />       

      <View style={{marginTop: "10%", width: "80%"}}>
          <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
        justifyContent: "center", alignItems: "center", borderRadius: 40,
        backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
        onPress={() => { if (validate_field(Var.username,password, peso, altezza)){
          api_signup_call(Var.username, password, altezza, peso, navigation);}
          }}>

            <Text style={{color: "white", fontSize: 16}}> Registrati </Text>
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

img:{
  flex: 1, 
  width: null, 
  height: null, 
  resizeMode: 'contain'
}
});