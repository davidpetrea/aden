import { Text, Pressable, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../stores/playerStore';
import { colors } from 'theme/colors';
import {
  Battle,
  Enemy,
  useGameManagerStore,
} from '../../stores/gameManagerStore';

import { HomeStackScreenProps, MainTabScreenProps } from 'src/navigation/types';

const enemy1: Enemy = {
  id: '123',
  health: 10,
  initiative: 15,
  loot: ['item1'],
};

const enemy2: Enemy = {
  id: 'asda',
  health: 10,
  initiative: 3,
  loot: ['item1'],
};

function Town({ navigation, route }: HomeStackScreenProps<'Town'>) {
  const player = usePlayerStore((state) => state.player);
  const removePlayer = usePlayerStore((state) => state.removePlayer);

  const { navigate } = navigation;

  const {
    setCurrentBattle,
    initBattle,
    currentBattle,
    getCurrentBattle,
    endBattle,
    damageEnemyById,
  } = useGameManagerStore((state) => ({
    getCurrentBattle: state.getCurrentBattle,
    setCurrentBattle: state.setCurrentBattle,
    initBattle: state.initBattle,
    currentBattle: state.currentBattle,
    endBattle: state.endBattle,
    damageEnemyById: state.damageEnemyById,
  }));

  const newBattle: Battle = {
    enemies: [enemy1, enemy2],
    player: player!,
  };

  const handleBattleStart = () => {
    //Init battle
    setCurrentBattle(newBattle);

    initBattle();

    console.log(getCurrentBattle());
  };

  const handleEnemyDamage = (enemyId: string) => {
    damageEnemyById(enemyId, 2);
  };

  if (!player) {
    return null;
  }

  return (
    <SafeAreaView className='flex-1 gap-y-4 items-center bg-neutral-900 p-4'>
      {/* Character panel */}
      <View className='bg-neutral-800 p-3 rounded-md w-full flex flex-row justify-between items-center'>
        <View className='flex items-start gap-y-2'>
          <Text className='text-lg font-bold text-slate-50'>
            {player?.name}
          </Text>
          <Text
            className={`capitalize font-bold text-[${
              colors[player?.specialization]
            }]`}
          >
            {player?.specialization}
          </Text>
        </View>
        <View className='self-end'>
          <Text className='text-slate-400 text-xl font-bold'>
            Lv. {player.level}
          </Text>
        </View>
      </View>
      {/* Skills */}
      {/* <View>
        <Text className='text-orange-500'>Your skills:</Text>
        {player.skills.map((skill) => (
          <Text key={skill.name} className='text-slate-50'>
            {skill.name}
          </Text>
        ))}
      </View> */}
      {/* <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={() => {
          learnSkill(Whirlwind);
        }}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          Learn skill
        </Text>
      </Pressable> */}

      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={() => {
          removePlayer();
        }}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          Delete character
        </Text>
      </Pressable>
      <TouchableOpacity
        onPress={() => navigation.navigate('Inventory')}
        className='bg-green-300 my-4 p-3'
      >
        <Text className='text-xl text-white'>Inventory</Text>
      </TouchableOpacity>

      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={handleBattleStart}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          Start battle
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default Town;
