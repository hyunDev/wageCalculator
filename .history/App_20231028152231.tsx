import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SaveScreen from './SaveScreen';
import TimerScreen from './TimerScreen';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';

export default function App() {
  // const Stack = createNativeStackNavigator();
  const Tab = createMaterialTopTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Record" component={SaveScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
