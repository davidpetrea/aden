import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

import NavContainer from './src/navigation/NavContainer';
import { usePlayerStore } from './src/stores/playerStore';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Josefin-Sans': require('./assets/fonts/JosefinSans.ttf'),
  });

  const dummy = 'text-[#3b82f6] text-[#f97316]';

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <NavContainer />;
}
