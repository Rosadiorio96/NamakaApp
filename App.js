
import { WebView } from 'react-native-webview';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {LoginScreen} from './src/LoginScreen';
import {SignUpScreen} from './src/SignupScreen';
import {HomePage} from './src/HomePage'
import { AddBottleScreen } from './src/AddBottleScreen';
import {GraphScreen} from './src/GraphScreen'
import {MapScreen} from './src/MapScreen'
import {BorracceScreen} from './src/BorracceScreen'
import {IntroScreen} from './src/IntroScreen'
import {GruppoInfoScreen} from './src/GruppoInfoScreen'
import {GruppiScreen} from './src/GruppiPage'
import {NotificheScreen} from './src/NotifichePage'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{headerShown: false}}>
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen
          name="Login"
          component= {LoginScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="AddBottlePage" component={AddBottleScreen} />
        <Stack.Screen name="GraphPage" component={GraphScreen} />
        <Stack.Screen name="MapPage" component={MapScreen} />
        <Stack.Screen name="BorraccePage" component={BorracceScreen} />
        <Stack.Screen name="GruppoInfoPage" component={GruppoInfoScreen} />
        <Stack.Screen name="GruppoPage" component={GruppiScreen} />
        <Stack.Screen name="NotifichePage" component={NotificheScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

