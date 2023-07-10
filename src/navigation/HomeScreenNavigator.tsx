import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import Home from '../screens/game/Home';
import Inventory from '../screens/game/Inventory';

const Stack = createStackNavigator(); // creates object for Stack Navigator

const HomeScreenNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Main' component={Home} />
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

export default HomeScreenNavigator;
