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
              AsyncStorage.setItem('@SignIn', "true");
              AsyncStorage.setItem('@username', String(username));
            } catch (e) {
              console.log("Errore salvataggio login!")
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
            }).then((res)=>res.json()).then((resJson)=>{
              console.log(typeof(resJson["access"]));
              if(resJson.hasOwnProperty('access')){
                try {
                  AsyncStorage.setItem('@storage_tokenAccess', resJson["access"]);
                  AsyncStorage.setItem('@storage_tokenRefresh', resJson["refresh"]);
                  AsyncStorage.setItem('@SignIn', "true");
                  AsyncStorage.setItem('@username', String(username));
                } catch (e) {
                  console.log("Errore salvataggio variabili registrazione!")
                }
                navigation.navigate('HomePage', { name: username })
              } else {
                alert("Errore registrazione...");
              }
              
            });
      
          }catch(e){
            alert("Errore registrazione -> server");
          }
        
         }

const refresh_Access_Token = async (stringa, navigation)=>{  
  console.log("check refresh token") 
  const tokenRefresh = await AsyncStorage.getItem('@storage_tokenRefresh'); 
  const signiIn = await AsyncStorage.getItem('@SignIn'); 
  try{
    await fetch( uri +'token/refresh/', {
      method: 'post',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh : tokenRefresh
      })
    }).then((res)=>res.json()).then((resJson)=>{
      if(resJson.hasOwnProperty('access')){
        try {
          AsyncStorage.setItem('@storage_tokenAccess', resJson["access"]);
          
          switch (stringa){
            case "AddBottle":
              console.log("Token di accesso refreshato -- AddBottle");
              navigation.navigate("BorraccePage", {name: Var.username})
              alert("Errore, riprova ad inquadrare il QRcode")
              break;
            case "posizione":
              console.log("Token di accesso refreshato -- posizione");
              break;
            case "Login":
              console.log("Token di accesso refreshato -- Login")
              break;
            default:
              console.log("Token di accesso refreshato -- generico");
              break;
          }
        } catch (e) {
          console.log("Errore salvataggio nuovo Token!")
        }
      } else {
        if (signiIn != 'false'){
          navigation.navigate("Login", {name: Var.username});
          AsyncStorage.setItem('@SignIn', "false");
          alert("Sessione scaduta! Riesegui il login");
        }
        
      }
    });
  }catch(e){
    if (signiIn != 'false'){
      navigation.navigate("Login", {name: Var.username})
      AsyncStorage.setItem('@SignIn', "false");
      alert("Sessione scaduta! Riesegui il login");
    }
  }
}
     

export const api_add_Bottle = async (payload, navigation)=>{
  var url = uri + "borracciaprop/"+ String(Var.username);
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
  try{
    await fetch(url, {
      method: 'post',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': tokenAccess
      },
      body: JSON.stringify(payload)
    }).then(response => {
      console.log(response['status']);
      if(response['status']==200){
        navigation.navigate('BorraccePage', { name: Var.username })
        alert("Borraccia aggiunta correttamente");
      } else if (response['status'] == 401){
        refresh_Access_Token("AddBottle", navigation)
      }
      else{
        alert("Impossibile aggiungere la borraccia");
      }});

  }catch(e){
    alert("Impossibile aggiungere la borraccia");
    console.log("Errore nel conttatare server");
    console.log(e);
  }
}


export const api_modify_position = async (payload, navigation)=>{
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
  var url = uri + "utenteposizione/"+ String(Var.username);
  try{
    await fetch(url, {
      method: 'post',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': tokenAccess
      },
      body: JSON.stringify(payload)
    }).then(response => {
      console.log(response['status']);
      if(response['status']==200){
        console.log("-- Posizione aggiornata correttamente! --");
      } else if (response['status'] == 401){
          refresh_Access_Token("posizione", navigation)
      } else{
          console.log("Impossibile modificare posizione utente. Il server non risponde");
      }});

  }catch(e){
    console.log("Errore nel contattare il server");
    console.log(e);
  }
}


export const check_token = async ()=>{
  console.log("check token Access")
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
  var url = uri + "api/token/verify/"
  try{
    await fetch(url, {
      method: 'post',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': tokenAccess
      },
      body: JSON.stringify({'token': tokenAccess})
    }).then(response => {
      console.log(response['status']);
      if(response['status']==200){
        console.log("-- L'utente è loggatto! --");
        return true;
      } else if (response['status'] == 401){
          refresh_Access_Token("Login", navigation)
          return true;
      } else{
          alert("Impossibile verificare stato utente");
          return false;
      }});

  }catch(e){
    console.log("Errore nel contattare il server");
    console.log(e);
    return false;
  }

}


export const api_remove_bottle = async (item, name, navigation)=>{
  console.log("APIIII", item["id_borraccia"]);
  console.log("name", name);

    try{
      await fetch(uri + 'remove', {
        method: 'post',
        mode: 'no-cors',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_borraccia: item["id_borraccia"],
          user: name
        })
      }).then(response => {
        console.log(response['status']);
        if(response['status']==200){
          navigation.navigate('BorraccePage', { name: name })
          console.log("riuscito")
        }
        else{
          alert("non riuscito")
        }});

    }catch(e){
      console.log("erroreeee");
      console.log(e);
    }
}


export const visualizzaInviti = async ()=>{
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
  const name = await AsyncStorage.getItem('@username'); 
  try{
    await fetch(uri + 'inviti/'+ name, {
      method: 'get',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': tokenAccess
      }
    }).then((res)=>res.json()).then((resJson)=>{
      console.log(resJson['inviti']);
      return resJson['inviti']
    });

  }catch(e){
    console.log("erroreeee");
    console.log(e);
  }
}

export const getTokenFromStore = async ()=>{
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
  const name = await AsyncStorage.getItem('@username'); 
  if (tokenAccess != null) {
    return {"Token": tokenAccess, 'name': name}
  }
 

}


export const modificaStatoInvito = async (NEWSTATO, mittente, gruppo)=>{
  const name = await AsyncStorage.getItem('@username'); 
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
  try{
    await fetch(uri + 'modificaStatoInvito/'+ name, {
      method: 'post',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': tokenAccess
      },
      body: JSON.stringify({
        'mittente': mittente,
        'gruppo': gruppo,
        'stato': NEWSTATO
      })
    }).then(response => {
      console.log(response['status']);
      if(response['status']==200){
        alert("Nessun problema")
      }
      else{
        alert("PROBLEMI")
      }});

  }catch(e){
    console.log("erroreeee");
    console.log(e);
  }

}




