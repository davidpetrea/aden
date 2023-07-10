import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import NameSelect from '../screens/intro/NameSelect';

// import LoginScreen from '../screens/LoginScreen';

export type IntroStackParams = {
  NameSelect: undefined;
  ClassSelect: undefined;
};

const Stack = createNativeStackNavigator<IntroStackParams>();

const IntroStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='NameSelect' component={NameSelect} />
      <Stack.Screen name='ClassSelect' component={NameSelect} />
    </Stack.Navigator>
  );
};

export default IntroStack;
