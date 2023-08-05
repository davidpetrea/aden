import { Text } from 'react-native';
import { View } from 'react-native';
import StatsContainer from './StatsContainer';

const PlayerPanel = () => {
  return (
    <View className='bg-stone-900 w-full border-t border-zinc-800 h-[30%] justify-between'>
      <Text>Player panel</Text>
      <StatsContainer />
    </View>
  );
};

export default PlayerPanel;
