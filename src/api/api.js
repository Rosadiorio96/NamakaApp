import AsyncStorage from '@react-native-async-storage/async-storage';
import { Var } from './Var.js';
import { Alert } from 'react-native';
import { BackHandler } from 'react-native';
import { createAnimatedPropAdapter } from 'react-native-reanimated';

export const uri = 'http://192.168.1.17:8081/api/'

export const getTokenAccess = async ()=>{
  try {
    const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
    return tokenAccess
  }catch(e){
            console.log("Errore Token Access")
          }
 
  const name = await AsyncStorage.getItem('@username'); 
}

export const getTokenRefresh = async ()=>{
  try {
    const tokenAccess = await AsyncStorage.getItem('@storage_tokenRefresh');
    return tokenAccess
  }catch(e){
    console.log("Errore Token Refresh")
  }
 
  
}

export const getSignIn = async ()=>{
  try {
    const signiIn = await AsyncStorage.getItem('@SignIn');
    return signiIn
  }catch(e){
    console.log("Errore SignIn")
  }
}

export const exit_app = () =>{
  Alert.alert("Attenzione!", "Sei sicuro di voler uscire?", [
    {
      text: "Indietro",
      onPress: () => null,
      style: "cancel"
    },
    { text: "Si", onPress: () => BackHandler.exitApp() }
  ]);
  return true;
}




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
            Var.password=""
          } else {
            //alert("Errore Login");
          }
          
        });
  
      }catch(e){
        Alert.alert("Attenzione","L'utente non è registrato oppure l'indirizzo email o la password sono errati");
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
            }).then((res)=>{
              console.log("RES", res)
              if(res['status']==200){
              console.log("La registrazione è andata a buon fine!");
              return res.json();
            } else if (res['status'] == 405){
                alert("Scegli una password più complessa")
                return false;
            } else{
              console.log("La registrazione non è andata a buon fine!");
              return false;
            }}).then((resJson)=>{
              if(resJson){
              if(resJson.hasOwnProperty('access')){
                try {
                  AsyncStorage.setItem('@storage_tokenAccess', resJson["access"]);
                  AsyncStorage.setItem('@storage_tokenRefresh', resJson["refresh"]);
                  AsyncStorage.setItem('@SignIn', "true");
                  AsyncStorage.setItem('@username', String(username));
                  Var.password=""
                } catch (e) {
                  console.log("Errore salvataggio variabili registrazione!")
                }
                navigation.navigate('HomePage', { name: username })
              }}
            });
      
          }catch(e){
            alert("Errore registrazione -> server");
          }
        
         }

export const refresh_Access_Token = async (stringa, navigation)=>{  
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
            case "Borracce":
                console.log("Token di accesso refreshato -- Borracce")
                break;
            case "Grafico":
                console.log("Token di accesso refreshato -- Grafico")
                break;
            case "Inviti":
                console.log("Token di accesso refreshato -- Inviti")
                break;
            case "Gruppipage":
                console.log("Token di accesso refreshato -- Gruppipage")
                break;
            case "GruppoInfo":
                console.log("Token di accesso refreshato -- GruppoInfo")
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
      }else if (response['status'] == 403){
        navigation.navigate('BorraccePage', { name: Var.username })
        alert("Questa borraccia e' già associata a qualcuno!")
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
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
    try{
      await fetch(uri + 'remove', {
        method: 'post',
        mode: 'no-cors',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': tokenAccess
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
        } else if (response['status'] == 401){
          refresh_Access_Token("Borracce", navigation)
          return true;
      } else{
          alert("Eliminazione borraccia non riuscita")
        }});

    }catch(e){
      console.log("erroreeee");
      console.log(e);
    }
}


export const modify_fabbisogno = async (username, fabbisogno, navigation)=>{
    try{
      await fetch(uri + 'utentefabb/'+ username, {
        method: 'post',
        mode: 'no-cors',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fabbisogno: fabbisogno
        })
      }).then((res)=>{
        console.log("RES", res)
        if(res['status']==200){
        console.log("La modifica e' andata buon fine!");
        
      }  else{
        console.log("La modifica non e' andata buon fine!");
        
      }});
    }catch(e){
      alert("Errore modifica -> server");
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
    }).then((res)=>{
      if(res['status']==200){
          console.log("-- L'utente è loggato! --");
          return res.json();
      } else if (res['status'] == 401){
          refresh_Access_Token("Inviti", navigation)
          return false;
      } else{
          console.log("Impossibile visualizzare gli inviti! Riprova più tardi");
          return false;
      }}).then((resJson)=>{
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


export const modificaStatoInvito = async (NEWSTATO, mittente, gruppo, creatore, navigation)=>{
  console.log("CREATORE-------------------", creatore)
  console.log("GRUPPO-------------------", gruppo)
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
        'stato': NEWSTATO,
        'creatore': creatore
      })
    }).then(response => {
      console.log(response['status']);
      
      if(response['status']==200){
        console.log("Invito accettato")
      } else if (response['status'] == 401){
        refresh_Access_Token("Inviti", navigation)
        console.log("Problemi modifica stato Invito")
      }
      else{
        console.log("Problemi vari modifica stato invito")
      }});

  }catch(e){
    console.log("erroreeee");
    console.log(e);
  }

}


export const creaGruppo = async (gruppo, navigation)=>{
  
  const name = await AsyncStorage.getItem('@username'); 
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
  try{
    await fetch(uri + 'creaGruppo/'+ name, {
      method: 'post',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': tokenAccess
      },
      body: JSON.stringify({
        'nomeGruppo': gruppo,
      })
    }).then(response => {
      console.log(response['status']);
      
      if(response['status']==200){
        console.log("Creazione gruppo riuscita")
      }
      else if (res['status'] == 401){
        console.log("Creazione gruppo non riuscita causa token")
        refresh_Access_Token("Gruppipage", navigation)
      }
      else{
        alert("PROBLEMI")
      }
    
    });

  }catch(e){
    console.log("erroreeee");
    console.log(e);
  }

}


export const creaPartecipante = async (nomepartecipante, namegruppo,creatore, navigation)=>{
  
  const name = await AsyncStorage.getItem('@username'); 
  const tokenAccess = await AsyncStorage.getItem('@storage_tokenAccess');
  try{
    await fetch(uri + 'invita', {
      method: 'post',
      mode: 'no-cors',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': tokenAccess
      },
      body: JSON.stringify({
        'mittente': Var.username,
        'destinatario': nomepartecipante,
        'gruppo': namegruppo,
        'creatore':creatore
      })
    }).then(response => {
      console.log(response['status']);
      
      if(response['status']==200){
        Alert.alert("Invito inviato", "A breve l'utente riceverà il tuo invito");
      } else if (response['status'] == 401){
        console.log("Invito non riuscito causa token")
        refresh_Access_Token("CreaPartecipante", navigation)
      }
      else{
        Alert.alert("Attenzione","L'utente è già stato invitato")
      }
    
    });

  }catch(e){
    console.log("erroreeee");
    console.log(e);
  }

}



export const set_SignInFalse = async () => {
  try {
    await AsyncStorage.setItem('@SignIn', 'false');
    console.log("Rimosso")
    return true;
}
catch(exception) {
    console.log("Errore set signIn")
    return false;
}
}


export const removeItemValue = async (key) =>{
  try {
      await AsyncStorage.removeItem(key);
      console.log("Rimosso")
      return true;
  }
  catch(exception) {
      console.log("Errore")
      return false;
  }
}


export const logout = (navigation)  => {
  Var.username=""
  set_SignInFalse().then(()=> 
  removeItemValue('@storage_tokenRefresh')).then(()=> 
  removeItemValue('@storage_tokenAccess')).then(()=>navigation.navigate("Login", {name: Var.username}));
  
}



