import { Text } from 'react-native';
import { View } from 'react-native';
import StatsContainer from './StatsContainer';
import Inventory from './Inventory';
import SkillsContainer from './SkillsContainer';

const PlayerPanel = () => {
  return (
    <View className='bg-stone-900 w-full border-t border-zinc-800 flex-1 justify-end'>
      <Text>Player panel</Text>
      <View className='flex-row w-full h-[150px]'>
        <Inventory />
        <SkillsContainer />
      </View>
      <StatsContainer />
    </View>
  );
};

export default PlayerPanel;
