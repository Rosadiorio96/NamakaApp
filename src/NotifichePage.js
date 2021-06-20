import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, FlatList, ActivityIndicator  } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import {refresh_Access_Token, uri, getTokenFromStore, modificaStatoInvito, logout, getSignIn, exit_app} from './api/api.js'
import { Var } from './api/Var.js';
import { Appbar, Menu, Provider } from 'react-native-paper'; 


export const NotificheScreen = ({ route, navigation}) => {

    const [data, setData]=useState([])
    const [isLoading, setisLoading]=useState(false)
    const isFocus = useIsFocused()
    const [shouldShow, setShouldShow] = useState(false)

    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
  
    const closeMenu = () => setVisible(false);
  
    const backAction = () => {
      navigation.navigate('GruppoPage', { name: Var.username })
     };
  
 
    const getInviti = async ()=>{
      getSignIn().then((signIn)=>{
        if (signIn == 'true'){
          getTokenFromStore().then((dataV) =>{
            const apiURL = uri+"socialApp/inviti/"+ Var.username
            fetch(apiURL, {
              method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': dataV['Token'],
                'Content-Type': 'application/json'
            }
            }).then((res)=>{
              if(res['status']==200){
                console.log("-- L'utente è loggato! --");
                return res.json();
              } else if (res['status'] == 401){
                  refresh_Access_Token("Inviti", navigation)
                  return false;
              } else{
                console.log("Impossibile visualizzare le borracce! Riprova più tardi");
                return false;
              }
            }).then((resJson)=>{
              if (resJson){
                setData(resJson['inviti']);
              }
            })
          })
        }
      
      }
      )
    }


    useEffect(() => {
       
          getInviti()
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            exit_app
          );
      
          return () => backHandler.remove();
        
    }, [isFocus]);

 
   

    const renderItem = ({item}) => {
        return (
          <View>
            { item.stato == "VISUALIZZATO"
            ?
            <View style={style.visualizzato}>
              <View style={{margin: 10}}>
            <Text style={style.info}>{item.mittente} ti ha inviato a far parte del gruppo {item.gruppo}  </Text>
            <View style={{flexDirection: "row",  }}>
            <TouchableOpacity style={style.button}
              
              onPress={() => {modificaStatoInvito("ACCETTATO", item.mittente, item.gruppo, item.creatore, navigation).then(() => {getInviti(); })
                              setShouldShow(false);
                              }
                              }
              ><Text> Accetta</Text></TouchableOpacity>
              <TouchableOpacity style={style.button}
              
              onPress={() => {modificaStatoInvito("RIFIUTATO", item.mittente, item.gruppo, item.creatore, navigation).then(() => {getInviti(); }) 
                              setShouldShow(false)
                  
                            }}
              ><Text> Rifiuta</Text></TouchableOpacity>
              </View>
            </View>


            </View>
            :
            item.stato == "NON VISUALIZZATO"
            ?
            <View style={style.nonvisualizzato}>
              <View style={{margin: 10}}>
            <Text style={style.info}>{item.mittente} ti ha inviato a far parte del gruppo {item.gruppo}  </Text>
            <View style={{flexDirection: "row",  }}>
            <TouchableOpacity style={style.button}
              
              onPress={() => {modificaStatoInvito("ACCETTATO", item.mittente, item.gruppo, item.creatore, navigation).then(() => {getInviti(); Alert.alert("Invito accettato", "Ora fai parte del gruppo")  })
                              setShouldShow(false);
                              }
                              }
              ><Text> Accetta</Text></TouchableOpacity>
              <TouchableOpacity style={style.button}
              
              onPress={() => {modificaStatoInvito("RIFIUTATO", item.mittente, item.gruppo, item.creatore, navigation).then(() => {getInviti(); Alert.alert("Invito rifiutato", "Hai rifiutato l'invito")}) 
                              setShouldShow(false)
                  
                            }}
              ><Text> Rifiuta</Text></TouchableOpacity>
              </View>
            </View>


            </View>
            :
            <View opacity={0.6} style={{ flex: 1, justifyContent: 'center', marginBottom: 20, marginTop: 10, backgroundColor: "white",
            borderRadius: 10, borderWidth: 1, borderColor: "#D5D5D5"}}>
              <View style={{margin: 10}}>
            <Text style={style.info}>{item.mittente} ti ha inviato a far parte del gruppo {item.gruppo}  </Text>
            </View>
            </View>
            }
            </View>

          

                          )
      }

      const renderFooter = () =>{
        return (
          isLoading ? 
        <View style = {style.loader}>
          <ActivityIndicator size="large"/>
        </View> : null
        )
        
      }

      const handleLoadMore = () => {
        setisLoading(true)
      }

    return (
      <View  style={{  height: "100%"}} >
      <View style={{ width: "100%", height:'14%', position: 'absolute', zIndex:100}} >
      <Provider>
      <Appbar.Header>
      
      <Appbar.BackAction onPress={backAction} />
      <Appbar.Content/>
        <Menu
        onDismiss={closeMenu}
        visible={visible}
        anchor={
          <Appbar.Action color="white" icon="dots-vertical" onPress={openMenu} />
        }>
          <Menu.Item icon='account' title={Var.username} onPress={()=>{navigation.navigate("ProfilePage", {'namePage':"NotifichePage"}); closeMenu()}}/>
       <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
    </Appbar.Header>
    </Provider>
    </View>
    <View style={{ flex: 1, width: "95%", height:"100%", marginLeft: 10, marginTop: "15%", zIndex:99}} onTouchStart={() => closeMenu()}>
    <FlatList
    style={style.container}
    data = {data}
    renderItem = {renderItem}
    ListFooterComponent = {renderFooter}
    keyExtractor={(item, index) => index.toString()}
    onEndReached = {handleLoadMore}
    onEndReachedThreshold={0.5}
    extraData={data}
    
    />
   </View>
   </View>
    )

}


const style = StyleSheet.create({

  loader:{
  marginTop: 10,
  alignItems: 'center'
  },
  
  info:{
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  },
 
  button:{
        borderWidth: 1, height: 42, width: "30%", marginTop: 10,
        justifyContent: "center", alignItems: "center", borderRadius: 10,
        backgroundColor: "#4EBDE5", alignSelf: "center", textAlign: "center", marginRight: "40%",
        borderColor: "#D5D5D5"
  },
  visualizzato:{
    flex: 1, justifyContent: 'center', marginBottom: 20, marginTop: 10, backgroundColor: "white",
            borderRadius: 10, borderWidth: 1, borderColor: "#D5D5D5"
  },
  nonvisualizzato:{
    flex: 1, justifyContent: 'center', marginBottom: 20, marginTop: 10, backgroundColor: "#D8ECF3",
    borderRadius: 10, borderWidth: 1, borderColor: "#D5D5D5"
  }
  
  });