import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/game/Home';
import Map from '../screens/game/Map';

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Map' component={Map} />
    </Tab.Navigator>
  );
}

export default Tabs;
