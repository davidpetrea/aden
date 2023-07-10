import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';

import GameStack from './GameStack';
import IntroStack from './IntroStack';
import { useUserStore } from '../stores/userStore';

const NavContainer = () => {
  const { username, getUsername } = useUserStore();

  useEffect(() => {
    getUsername();
  }, [getUsername]);

  return (
    <NavigationContainer>
      {username ? <GameStack /> : <IntroStack />}
    </NavigationContainer>
  );
};

export default NavContainer;
