import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CharacterCreate from '../../screens/intro/CharacterCreate';
import { IntroStackParamList } from '../types';

const Stack = createNativeStackNavigator<IntroStackParamList>();

const IntroStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='CharacterCreate' component={CharacterCreate} />
    </Stack.Navigator>
  );
};

export default IntroStack;
