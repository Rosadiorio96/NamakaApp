import { WebView } from 'react-native-webview';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';




export const HomePage = ({ navigation }) => {

  

  return (
      <View style={{ width: "100%", height: "100%", justifyContent: "center", alignSelf: "center", alignContent: "center", alignItems: "center"}}>

       <Text>Welcome In the Home page</Text>

    </View>

  );
    
};