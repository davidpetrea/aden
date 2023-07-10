import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Home from '../screens/game/Home';

export type GameStackParams = {
  Home: undefined;
  Character: undefined;
};

const Stack = createNativeStackNavigator<GameStackParams>();

const GameStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
  );
};

export default GameStack;
