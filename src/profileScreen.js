import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, TextInput  } from 'react-native';
import {Var} from './api/Var.js'
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import {refresh_Access_Token, uri, getTokenFromStore, logout, getSignIn, exit_app, modify_fabbisogno} from './api/api.js'
import { Appbar, Menu, Provider} from 'react-native-paper'; 



const validate_field=(fabbisogno)=>{
    if(isNaN(fabbisogno) || fabbisogno<=0){
        Alert.alert("Attenzione","Il fabbisogno deve essere un numero positivo");
        return false;
      }
      return true
      
}



export const profileScreen = ({ route, navigation}) => {
    const pagina = route.params['namePage']

    const isFocused = useIsFocused();
    const [data, setData]=useState([]);
    const [editable, setEditable]=useState(false);
    const [nameButton, setNameButton] = useState("Modifica fabbisogno");
    const [visibleMenu, setvisibleMenu] = useState(false);
    const [ColorText, setColorText] = useState("black");
    const [fabbisogno, setfabbisogno] = useState("");

    const openMenu = () => setvisibleMenu(true);

    const closeMenu = () => setvisibleMenu(false);
    const backAction = () => {
        navigation.navigate(pagina, { name: Var.username })
       };

    useEffect(() => {
        getData();
        console.log(data)
    }, [isFocused]);

    getData = async () =>{
        getSignIn().then((signIn)=>{
        if (signIn == 'true'){
          getTokenFromStore().then((dati) => {
            const apiURL = uri+"utente/"+ Var.username
            fetch(apiURL, {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': dati['Token'],
                    'Content-Type': 'application/json'
                }
                }).then((res)=>{
                  if(res['status']==200){
                  console.log("-- L'utente è loggato! --");
                  return res.json();
                } else if (res['status'] == 401){
                    refresh_Access_Token("Grppipage", navigation)
                    return false;
                } else{
                  console.log("Impossibile visualizzare i gruppi! Riprova più tardi");
                  return false;
                }
              }).then((resJson)=>{
                    if (resJson){
                        setData(resJson['utente']);
                        setfabbisogno(resJson['utente'][0].fabbisogno.toString())
                    }
                   
                  })
                })
              }
            
            }
            )
          }
    return (
    <View>
      <Provider>
      <Appbar.Header>
      
      <Appbar.BackAction onPress={backAction} />
      <Appbar.Content/>
        <Menu
        onDismiss={closeMenu}
        visible={visibleMenu}
        anchor={
          <Appbar.Action color="white" icon="dots-vertical" onPress={openMenu} />
        }>
      <Menu.Item icon='account' title={Var.username} />
       <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
    </Appbar.Header>
    </Provider>

    <View  style={{ height: "90%", width:'100%', justifyContent: 'center'}}>
    <Text style={{ textAlign:'center', fontWeight:'bold', fontSize:20}} >Ciao </Text> 
    <Text style={{ textAlign:'center', marginTop:'5%', fontSize:17}}> {Var.username}</Text>
    <View style={{flexDirection: "row", width: "100%", marginLeft: 12, marginTop:'5%'}}>   
    <Text style={{  marginTop:'5.3%', marginLeft:'10%', fontSize:16 }}>Il tuo fabbisogno in litri calcolato è </Text>

            {   
            data.length!=0
            ?
            <View style={{flexDirection: "row", width: "50%", height: "30%", marginLeft: 12}}>
            <TextInput 
            style={{ width:'25%', position:'absolute', fontSize:18,color:ColorText, borderWidth:1}}
            defaultValue={fabbisogno}
            editable={editable}
            keyboardType='numeric'
            onChangeText={(value) => setfabbisogno(value)}
           />
           </View>
            
            :
            null
            
            }

            
</View>
<View>
<TouchableOpacity style={{borderWidth: 1, height: 42, width: "80%",
                        justifyContent: "center", alignItems: "center", borderRadius: 40,
                        backgroundColor: "black", alignSelf: "center", textAlign: "center",  marginBottom:20, marginTop:"10%"}}
                        onPress={() => {if (nameButton == "Modifica fabbisogno"){
                            setEditable(true);
                            setColorText('red')
                            setNameButton("Salva")
                        } else {
                            if (validate_field(fabbisogno)){
                                setEditable(false);
                                setColorText('black')
                                modify_fabbisogno(Var.username,fabbisogno)
                                setNameButton("Modifica fabbisogno")
                            }
                            
                        } }}>
              <Text style={{color: "white"}}> {nameButton}</Text>
      </TouchableOpacity>

      </View>
      </View>
        
        </View>)

}