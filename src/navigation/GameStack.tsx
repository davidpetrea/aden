import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/game/Home';
import Map from '../screens/game/Map';
import HomeScreenNavigator from './HomeScreenNavigator';

export type GameStackParams = {
  HomeScreenNavigator: undefined;
  Map: undefined;
};

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator<GameStackParams>();

const GameStack = () => {
  return (
    <>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Map' component={Map} />
      </Stack.Navigator> */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name='Home' component={HomeScreenNavigator} />
        <Tab.Screen name='Map' component={Map} />
      </Tab.Navigator>
    </>
  );
};

export default GameStack;
