import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import Town from '../../../screens/main/Town';
import Inventory from '../../../screens/main/Inventory';
import { HomeStackParamsList } from 'src/navigation/types';

const Stack = createStackNavigator<HomeStackParamsList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Town' component={Town} />
      <Stack.Screen
        name='Inventory'
        component={Inventory}
        options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
          headerStyleInterpolator: HeaderStyleInterpolators.forFade,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
