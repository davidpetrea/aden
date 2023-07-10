import { Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserStore } from '../../stores/userStore';
import { colors } from 'theme/colors';
import { Whirlwind } from '../../skills/warriorSkills';

function Home() {
  const { character, removeCharacter, learnSkill } = useUserStore();

  if (!character) {
    return <View>Error loading character. Try restarting the app.</View>;
  }

  return (
    <SafeAreaView className='flex-1 gap-y-4 items-center bg-neutral-900 p-4'>
      {/* Character panel */}
      <View className='bg-neutral-800 p-3 rounded-md w-full flex flex-row justify-between items-center'>
        <View className='flex items-start gap-y-2'>
          <Text className='text-lg font-bold text-slate-50'>
            {character?.name}
          </Text>
          <Text
            className={`capitalize font-bold text-[${
              colors[character?.specialization]
            }]`}
          >
            {character?.specialization}
          </Text>
        </View>
        <View className='self-end'>
          <Text className='text-slate-400 text-xl font-bold'>
            Lv. {character.level}
          </Text>
        </View>
      </View>
      {/* Skills */}
      <View>
        <Text className='text-orange-500'>Your skills:</Text>
        {character.skills.map((skill) => (
          <Text key={skill.name} className='text-slate-50'>
            {skill.name}
          </Text>
        ))}
      </View>
      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={() => {
          learnSkill(Whirlwind);
        }}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          Learn skill
        </Text>
      </Pressable>

      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={() => {
          removeCharacter();
        }}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          Delete character
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default Home;
