import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import { Alert, BackHandler } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BattleMain from '../../screens/battle/BattleMain';
import BattleInventory from '../../screens/battle/BattleInventory';
import { BattleStackParamList } from '../types';
import { useGameManagerStore } from '../../stores/gameManagerStore';

const Stack = createStackNavigator<BattleStackParamList>();

const BattleStack = () => {
  const { navigate } = useNavigation();
  const endBattle = useGameManagerStore((state) => state.endBattle);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        //TODO: prompt user if sure that he wants to exit battle
        endBattle();
        //navigate to town
        navigate('Main', {
          screen: 'Home',
          params: {
            screen: 'Town',
          },
        });

        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='BattleMain' component={BattleMain} />
      <Stack.Screen
        name='BattleInventory'
        component={BattleInventory}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          headerStyleInterpolator: HeaderStyleInterpolators.forFade,
        }}
      />
    </Stack.Navigator>
  );
};

export default BattleStack;
