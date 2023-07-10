import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

import NavContainer from './src/navigation/NavContainer';
import { useUserStore } from './src/stores/userStore';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Josefin-Sans': require('./assets/fonts/JosefinSans.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <NavContainer />;
}
