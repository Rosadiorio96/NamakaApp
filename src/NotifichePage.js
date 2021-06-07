import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Button, BackHandler, TouchableOpacity, View, Alert, Image, FlatList, ActivityIndicator  } from 'react-native';
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import {visualizzaInviti, uri, getTokenFromStore, modificaStatoInvito, logout, getSignIn} from './api/api.js'
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
      navigation.navigate('HomePage', { name: Var.username })
     };
  
 
    const getInviti = async ()=>{
      getSignIn().then((signIn)=>{
        if (signIn == 'true'){
          getTokenFromStore().then((dataV) =>{
            const apiURL = uri+"inviti/"+ dataV['name']
            fetch(apiURL, {
              method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': dataV['Token'],
                'Content-Type': 'application/json'
            }
            }).then((res)=>res.json()).then((resJson)=>{
              setData(resJson['inviti']);
              console.log("DATAAAAAA-------------",data)
            })
          })
        }
      
      }
      )
    }


    useEffect(() => {
       
          getInviti()
        
        
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
              
              onPress={() => {modificaStatoInvito("ACCETTATO", item.mittente, item.gruppo).then(() => {getInviti();  Alert.alert("Invito accettato", "Ora fai parte del gruppo")})
                              setShouldShow(false);
                              }
                              }
              ><Text> Accetta</Text></TouchableOpacity>
              <TouchableOpacity style={style.button}
              
              onPress={() => {modificaStatoInvito("RIFIUTATO", item.mittente, item.gruppo).then(() => {getInviti();  Alert.alert("Invito rifiutato", "Hai rifiutato l'invito")}) 
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
              
              onPress={() => {modificaStatoInvito("ACCETTATO", item.mittente, item.gruppo).then(() => {getInviti(); Alert.alert("Invito accettato", "Ora fai parte del gruppo")  })
                              setShouldShow(false);
                              }
                              }
              ><Text> Accetta</Text></TouchableOpacity>
              <TouchableOpacity style={style.button}
              
              onPress={() => {modificaStatoInvito("RIFIUTATO", item.mittente, item.gruppo).then(() => {getInviti(); Alert.alert("Invito rifiutato", "Hai rifiutato l'invito")}) 
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
      <View>
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
       <Menu.Item title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
    </Appbar.Header>
    </Provider>
    <View  style={{height: "90%", justifyContent: 'center' }}>
    
    <View style={{ flex: 1, width: "95%", marginLeft: 10}}>
      
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
    </View>)

}


const style = StyleSheet.create({
    cointainer:{
      marginTop:20,
      backgroundColor: '#f5fcff',
      flex: 1,
       paddingBottom: 5 
    },
    itemRow: {
      borderRadius: 5,
      marginBottom:10,
      borderRadius: 7, 
      borderColor: "#D5D5D5",
      backgroundColor: "white",
      height: 100,
      flexDirection: "row",
      alignItems: "center",
    },
  loader:{
  marginTop: 10,
  alignItems: 'center'
  },
  
  textInputStyle: {
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: 'white',
    fontSize: 18,
    
  },
  info:{
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  },
  infoVis:{
    fontSize: 18,
    fontWeight: "bold",
    color: "red"
  },
  img:{
    flex: 1, 
    width: null, 
    height: null, 
    resizeMode: 'contain'
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