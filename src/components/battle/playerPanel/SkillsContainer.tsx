import { View, Text, Pressable } from 'react-native';
import { usePlayerStore } from '../../../stores/playerStore';
import uuid from 'react-native-uuid';

const SkillsContainer = () => {
  const player = usePlayerStore((state) => state.player);

  if (!player) return null;

  return (
    <View className='bg-neutral-800 border-y border-stone-950 w-4/5 flex-row items-center justify-start'>
      {player.skills.equipped.map((skill) => {
        const Icon = skill.icon;

        return (
          <View className='items-center' key={skill.id}>
            <Pressable
              onPress={() => console.log(skill.id)}
              className='items-center justify-center rounded-md bg-stone-600 w-20 h-20 mx-2'
              style={{ elevation: 3 }}
            >
              {Icon({
                width: 64,
                height: 64,
              })}
            </Pressable>
            <Text className='text-base font-bold text-gray-200'>
              {skill.name}
            </Text>
            <View className='flex-row items-center justify-center max-w-[60px]'>
              <Text className='text-base font-bold text-gray-200 mr-1'>
                Lv. {skill.level} &middot;
              </Text>

              <View className='bg-stone-900 w-6 h-6 rounded-full mx-1 justify-center items-center'>
                <View className='bg-purple-600 w-4 h-4 rounded-full mx-1'></View>
              </View>
              <Text className='text-base font-bold text-gray-400'>
                {skill.baseAPCost}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default SkillsContainer;
