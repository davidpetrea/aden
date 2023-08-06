import { Text } from 'react-native';
import { View } from 'react-native';
import StatsContainer from './StatsContainer';
import Inventory from './Inventory';
import SkillsContainer from './SkillsContainer';
import { usePlayerStore } from '../../../stores/playerStore';

const PlayerPanel = () => {
  const player = usePlayerStore((state) => state.player);
  if (!player) return null;

  return (
    <View className='bg-stone-900 w-full border-t border-zinc-800 flex-1 justify-end'>
      {/* Selected skill details */}
      <View className='bg-stone-800 flex-1 items-center'>
        <Text className='text-lg font-semibold text-gray-300'>
          Skill description:
        </Text>
        <Text className='text-gray-200 font-bold text-base'>
          {player.skills.selected.description}
        </Text>
      </View>
      <View className='flex-row w-full h-[150px]'>
        <Inventory />
        <SkillsContainer />
      </View>
      <StatsContainer />
    </View>
  );
};

export default PlayerPanel;
