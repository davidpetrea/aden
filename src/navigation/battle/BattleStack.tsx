import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';

import BattleMain from '../../screens/battle/BattleMain';
import BattleInventory from '../../screens/battle/BattleInventory';
import { BattleStackParamList } from '../types';


const Stack = createStackNavigator<BattleStackParamList>();

const BattleStack = () => {
 

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
