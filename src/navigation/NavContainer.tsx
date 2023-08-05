import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import MainTab from './main/MainTab';
import IntroStack from './intro/IntroStack';
import { usePlayerStore } from '../stores/playerStore';
import { useGameManagerStore } from '../stores/gameManagerStore';
import BattleStack from './battle/BattleStack';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const NavContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const player = usePlayerStore((state) => state.player);
  const getPlayer = usePlayerStore((state) => state.getPlayer);

  const currentBattle = useGameManagerStore((state) => state.currentBattle);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        await getPlayer();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [getPlayer]);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 gap-y-4 items-center justify-center bg-neutral-900 p-4'>
        <Text className='text-center font-bold text-lg text-slate-50'>
          Loading game data...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!player && <Stack.Screen name='Intro' component={IntroStack} />}
        {player && !currentBattle && (
          <Stack.Screen name='Main' component={MainTab} />
        )}
        {currentBattle && (
          <Stack.Screen name='Battle' component={BattleStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavContainer;
