
  
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Animated, TextInput, View, BackHandler} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg'
import { Var } from './api/Var.js';
import Icon  from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-datepicker';
import { LogBox } from 'react-native';
import {uri, logout, getSignIn, getTokenFromStore, refresh_Access_Token, exit_app} from './api/api.js'
import { Appbar, Menu, Provider} from 'react-native-paper'; 
const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedInput = Animated.createAnimatedComponent(TextInput)

var name;
var tot_sorsi;
var max;
var percentuale;
var data_sorsi;
var selected = false;
var today = new Date()
var oggi = today.getFullYear() +'-'+(today.getMonth()+1)+'-'+today.getDate()

export const GraphScreen = ({ route, navigation }) => {

    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();//Ignore all log notifications

    const [data, setData]=useState([])
    const [date, setDate] = useState(false);
    const [dataSelezionata, setDataSelezionata]=useState(oggi)
    name = route.params;
    const [visible, setVisible] = useState(false);

    var radius = 40
    var strokeWidth = 10
    var duration = 500
    var color = 'lightskyblue'
    var delay = 0
    
    var textcolor;
    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;
    const circleRef = React.useRef();
    const inputRef = React.useRef();

    const openMenu = () => setVisible(true);
  
    const closeMenu = () => setVisible(false);
    
    const backAction = () => {
      navigation.navigate("HomePage", name = name)
    };
    

getData = async () =>{
  selected =true
  getSignIn().then((signIn)=>{
  if (signIn == 'true'){
    getTokenFromStore().then((dati) => {
      const apiURL = uri+"api/grafico/"+ Var.username +'/'+ dataSelezionata
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
                refresh_Access_Token("Grafico", navigation)
                return false;
      } else{
          console.log("Impossibile visualizzare le borracce! Riprova più tardi");
          return false;
          }
          }).then((resJson)=>{
            if(resJson){
                tot_sorsi = resJson['info'][0]['totale']
                Var.fabbisogno = resJson['info'][0]['fabbisogno'] * 1000;          
                setData(resJson['info']);        
            }
            
          })
        })
      }
    }
    )
  }


    max = Var.fabbisogno;
    percentuale = ((Var.fabbisogno/2)*5)/100;

    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const animation = (toValue) => {
        return Animated.timing(animatedValue,{
            toValue,
            duration,
            delay,
            useNativeDriver:true,

        }).start();
    };

    

    useEffect(()=>{
      getData()
        if(tot_sorsi> Var.fabbisogno){
          tot_sorsi  = Var.fabbisogno
        }
        animation(tot_sorsi);
        animatedValue.addListener(v => {
            if(circleRef?.current){
                const maxPerc = 100 * v.value / max;
                const strokeDashoffset = circleCircumference - (circleCircumference*maxPerc)/100;                

                circleRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }

            if(inputRef?.current){
                inputRef.current.setNativeProps({
                    text: `${Math.round(v.value)}`,
                })
            }
        });
       
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          exit_app
        );
    

        return() => {
            animatedValue.removeAllListeners();
            backHandler.remove();
        };
    }, [max, tot_sorsi ]);

    

    return (

      <View>
      <Provider>
      <Appbar.Header>
      
      <Appbar.BackAction onPress={backAction} />
      <Appbar.Content/>
      <DatePicker
                    style={styles.datePickerStyle}
                    mode="date"
                    placeholder="Seleziona giorno"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        marginLeft: 0,
                        
                        position:'absolute'
                      },
                      dateInput: {
                        opacity:0,
                        display: 'none'
                        
                        }
                      
                    }}
                    onDateChange={(date) => {
                      data_sorsi = date
                      selected = true
                      setDataSelezionata(date)
                      getData()
                    }}
                    
                  />
            
        <Menu
        onDismiss={closeMenu}
        visible={visible}
        anchor={
          <Appbar.Action color="white" icon="dots-vertical" onPress={openMenu} />
        }>
        <Menu.Item icon='account' title={Var.username} onPress={()=>{navigation.navigate("ProfilePage", {'namePage':"GraphPage"}); closeMenu()}}/>
       <Menu.Item icon = 'logout' title="Logout" onPress={()=>{logout(navigation); closeMenu()}} />
        </Menu>
    </Appbar.Header>
    </Provider>


        <View style={{  width: "100%", height: "80%", flexDirection:'row', justifyContent: 'center',
              flexWrap: 'wrap', alignItems: 'center', marginTop: 30,}} >
         
       
         {
            selected == false
            ?
            <Text style={styles.textGraph}>Nessuna data selezionata</Text>
            :
            <View style={{ alignContent: "center"}}><Text style={styles.textGraph}>Il giorno selezionato è {dataSelezionata}</Text>
            <Text style={styles.textGraph}>Il tuo fabbisogno: {Var.fabbisogno} ml</Text>
            <Text style={styles.textGraph}>Quanto hai bevuto oggi: {tot_sorsi} ml</Text>
            <View style={{ flexDirection:'row', justifyContent: 'center',
              flexWrap: 'wrap', alignItems: 'center', alignContent: "center"}}>

        <View>
                    <Svg width={radius*5} 
                         height={radius*5} 
                        viewBox={`0 0 ${halfCircle*2} ${halfCircle*2}`}>
                        <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
                            <Circle
                                cx='50%'
                                cy='50%'
                                stroke={color}
                                strokeWidth={strokeWidth}
                                r={radius}
                                strokeOpacity={0.2}
                                fill="transparent"
                            />
                            <AnimatedCircle
                            ref={circleRef}
                                cx='50%'
                                cy='50%'
                                stroke={color}
                                strokeWidth={strokeWidth}
                                r={radius}
                                fill="transparent"
                                strokeDasharray={circleCircumference}
                                strokeDashoffset={circleCircumference}
                                strokeLinecap='round'
                            />
                        </G>
                
                    </Svg>
                    <AnimatedInput
                    ref={inputRef}
                       underlineColorAndroid= 'transparent'
                       editable={false}
                       defaultValue='0'
                       style={[
                           StyleSheet.absoluteFillObject,
                           {fontSize: radius/2, color: textcolor ?? color},
                           {fontWeight: '900', textAlign: 'center'}
                       ]}
                    />
        </View>
          
        
    {
        tot_sorsi >= Var.fabbisogno
           ?
            <View style={{marginLeft: 5}}>
            <Text style={styles.textGraph}>Complimenti, hai raggiunto il tuo fabbisogno giornaliero!</Text>
            <View style={{ flexDirection:'row', justifyContent: 'center',
                            flexWrap: 'wrap', alignItems: 'center', alignContent: "center"}} >
            <Icon name='heart-eyes' size={60} color='black'  style={{marginTop: 40}}/>
            </View>
                
            </View>
           :
           tot_sorsi >= (Var.fabbisogno/2)-(percentuale) && tot_sorsi <= (Var.fabbisogno/2)+(percentuale)
           ?
            <View>
            <Text style={styles.textGraph}> Sei a metà, continua così! </Text>
            <View style={{ flexDirection:'row', justifyContent: 'center',
                            flexWrap: 'wrap', alignItems: 'center', alignContent: "center"}} >
            <Icon name='smiley' size={60} color='black' style={{marginTop: 40}}/>
            </View>          
            </View>

           :
           tot_sorsi > (Var.fabbisogno/2)+(percentuale)
           ?      
           <View>
           <Text style={styles.textGraph}> Hai quasi raggiunto l'obiettivo! </Text>
           <View style={{ flexDirection:'row', justifyContent: 'center',
                           flexWrap: 'wrap', alignItems: 'center', alignContent: "center"}} >
           <Icon name='slightly-smile' size={60} color='black'  style={{marginTop: 40}}/>
           </View>         
           </View>
           :
           tot_sorsi < (Var.fabbisogno/2)-(percentuale) && tot_sorsi > 0
           ?
           <View>
            <Text style={styles.textGraph}> Potresti fare di meglio! </Text>
           <View style={{ flexDirection:'row', justifyContent: 'center',
                           flexWrap: 'wrap', alignItems: 'center', alignContent: "center"}} >
           <Icon name='frowning' size={60} color='black'  style={{marginTop: 40}}/>
           </View>
          
          </View>
           :
           <View>
               <Text style={styles.textGraph}> Non hai proprio bevuto, peccato! </Text>
               <View style={{ flexDirection:'row', justifyContent: 'center',
                           flexWrap: 'wrap', alignItems: 'center', alignContent: "center"}} >
           <Icon name='mad' size={60} color='black'  style={{marginTop: 40}}/>
           </View>
           </View>      
    }
 
        </View>     
            </View>
        }    
        </View>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
      textGraph:{
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center',
      },
      title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 20,
      },
      datePickerStyle: {
        width: 50
      },
  });
