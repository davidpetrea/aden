import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './home/HomeStack';
import Map from '../../screens/main/Map';

import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTab = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name='Home' component={HomeStack} />
        <Tab.Screen name='Map' component={Map} />
      </Tab.Navigator>
    </>
  );
};

export default MainTab;
