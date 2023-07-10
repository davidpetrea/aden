import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import GameStack from './GameStack';
import IntroStack from './IntroStack';
import { useUserStore } from '../stores/userStore';

const NavContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { character, getCharacter } = useUserStore();

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        await getCharacter();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [getCharacter]);

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
      {character ? <GameStack /> : <IntroStack />}
    </NavigationContainer>
  );
};

export default NavContainer;
