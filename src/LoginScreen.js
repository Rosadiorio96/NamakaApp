import React, { useState} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, BackHandler, Image } from 'react-native'
import Icon  from 'react-native-vector-icons/FontAwesome';
import { Var } from './api/Var.js';
import { api_login_call } from './api/api';
import { useIsFocused , useFocusEffect} from "@react-navigation/native";

const validate_field=(username, password)=>{
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; 
  console.log("username",username);
  console.log("password",password);
  console.log("regex",reg.test(username))


  if((username == "" || username==undefined) && (password == undefined || password=="")){
    Alert.alert("Attenzione","Per favore completa tutti i campi")
    return false;
  }
  if(username == undefined || username == ""){
    Alert.alert("Attenzione","Per favore inserisci l'email")
    return false;
  } 
  if (reg.test(username) === false && (password == undefined || password == "")) {
    Alert.alert("Attenzione","Inserire un indirizzo email valido");
    return false;
  }
  if(password == undefined || password==""){
    Alert.alert("Attenzione","Per favore inserisci la password")
    return false;
  }

 
  


  return true
}



export const LoginScreen = ({ navigation }) => {

  const isFocused = useIsFocused();
  const [hidePass, setHidePass] = useState(true);
  const [stato, setName] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setNameIcon = () => {
    setName(!stato);
  }



  useFocusEffect(() => {
    console.log("Use effect login ", isFocused)
    const backAction = () => {
      Alert.alert("Attenzione!", "Sei sicuro di voler uscire?", [
        {
          text: "Indietro",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Si", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  });
  

  return (
  
      <View style={{ width: "100%", height: "100%", justifyContent: "center", alignSelf: "center", alignContent: "center", alignItems: "center"}}>
           <View style={{height: "20%", width: "40%"}}>
              <Image style={styles.img} source={require('./img/logo.png')} />
            </View>
        
      
      <View style={styles.userSection}>  
      
        <TextInput placeholder={"Inserisci email"}
        onChangeText={(value) => {Var.username=value
        setUsername(value)}}
        value = {username}
        style={{height: 42, width: "80%", borderBottomWidth: 1, fontFamily:'monospace'}}
        />
     </View>

       <View style={styles.passSection}>  
        <TextInput placeholder={"Inserisci password"}
         style={styles.input}
         value = {password}
         
        onChangeText={(value) => {Var.password = value; setPassword(value)}}
        style={{height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%"}}
        secureTextEntry={hidePass ? true : false}/>  
 
        <Icon style={styles.iconStyle} name={stato ? 'eye' : 'eye-slash'} size={30} color='black' onPress={() => {
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
                            api_login_call(Var.username, Var.password,navigation)
                            setUsername("")
                            setPassword("")
                            }}}>
                 <Text style={{color: "white", fontSize: 16}}> Login </Text>
          </TouchableOpacity>

      </View>
      <View style={{marginTop: "10%", width: "80%"}}>
          <TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                            justifyContent: "center", alignItems: "center", borderRadius: 40,
                            backgroundColor: "black", alignSelf: "center", textAlign: "center"}}
                            onPress={() => {navigation.navigate('SignUp', { name: Var.username })
                            setUsername("")
                            setPassword("")}}>
                  <Text style={{color: "white", fontSize: 16}}> Registrati</Text>
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
  marginTop: 10,
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
img:{
  flex: 1, 
  width: null, 
  height: null, 
  resizeMode: 'contain'
}
});