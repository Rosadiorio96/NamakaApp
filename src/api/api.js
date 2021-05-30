import AsyncStorage from '@react-native-async-storage/async-storage';
import { Var } from './Var.js';

export const uri = 'http://192.168.1.17:8081/api/'

export const api_login_call= async (username, password, navigation)=>{
    console.log(username);
    console.log(password);
      try{
        await fetch( uri +'login', {
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

export const api_signup_call = async (username, password, altezza, peso, navigation)=>{
        console.log(username);
        console.log(password);
          try{
            await fetch(uri + 'registrazione', {
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



export const api_add_Bottle = async (payload, navigation)=>{
            console.log(payload);
            var url = uri + "borracciaprop/"+ String(Var.username);
            console.log(url);
            try{
              await fetch(url, {
                method: 'post',
                mode: 'no-cors',
                headers:{
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              }).then(response => {
                console.log(response['status']);
                if(response['status']==200){
                  console.log("ok");
                  navigation.navigate('BorraccePage', { name: Var.username })
                  alert("Borraccia aggiunta correttamente");
                }
                else{
                  alert("Impossibile aggiungere la borraccia");
                }});
          
            }catch(e){
              console.log("erroreeee");
              console.log(e);
            }
          }


export const api_modify_position = async (payload)=>{
            console.log(payload);
            var url = uri + "utenteposizione/"+ String(Var.username);
            console.log(url);
            try{
              await fetch(url, {
                method: 'post',
                mode: 'no-cors',
                headers:{
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              }).then(response => {
                console.log(response['status']);
                if(response['status']==200){
                  console.log("ok");
                }
                else{
                  alert("Impossibile modificare posizione utente");
                }});
          
            }catch(e){
              console.log("erroreeee");
              console.log(e);
            }
          }

