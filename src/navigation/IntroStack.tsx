import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CharacterCreate from '../screens/intro/CharacterCreate';

export type IntroStackParams = {
  CharacterCreate: undefined;
};

const Stack = createNativeStackNavigator<IntroStackParams>();

const IntroStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='CharacterCreate' component={CharacterCreate} />
    </Stack.Navigator>
  );
};

export default IntroStack;
