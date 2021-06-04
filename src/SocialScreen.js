import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, BackHandler, TouchableOpacity, View, Alert, Image, FlatList, ActivityIndicator  } from 'react-native';
import { useIsFocused, useFocusEffect, NavigationContainer } from "@react-navigation/native";
import {visualizzaInviti, uri, getTokenFromStore} from './api/api.js'
import { Var } from './api/Var.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {NotificheScreen} from './NotifichePage.js'
import {GruppiScreen} from './GruppiPage'
import {InvitaScreen} from './InvitaPage'

  
const Tab = createMaterialTopTabNavigator();

export const SocialScreen = ({ route, navigation}) => {
    
    return (
        <Tab.Navigator>
            <Tab.Screen name="Gruppi" component={GruppiScreen} />
            <Tab.Screen name="Notifiche" component={NotificheScreen} />
            <Tab.Screen name="Invita" component={InvitaScreen} />
        </Tab.Navigator>
      );
}

