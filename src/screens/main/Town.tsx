import uuid from 'react-native-uuid';
import { Text, Pressable, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../stores/playerStore';
import { colors } from 'theme/colors';
import {
  Battle,
  Enemy,
  useGameManagerStore,
} from '../../stores/gameManagerStore';

import { HomeStackScreenProps } from 'src/navigation/types';

const SKELETON_WARRIOR_BASE_HEALTH = 12;
const SKELETON_ARCHER_BASE_HEALTH = 8;

const enemy1: Enemy = {
  name: 'Skeleton Warrior',
  id: uuid.v4().toString(),
  currentHealth: SKELETON_WARRIOR_BASE_HEALTH,
  maxHealth: SKELETON_WARRIOR_BASE_HEALTH,
  initiative: 15,
  loot: ['item1'],
  damage: 3,
  level: 2,
  grade: 'common',
};

const enemy2: Enemy = {
  name: 'Skeleton Archer',
  id: uuid.v4().toString(),
  currentHealth: SKELETON_ARCHER_BASE_HEALTH,
  maxHealth: SKELETON_ARCHER_BASE_HEALTH,
  initiative: 3,
  loot: ['item1', 'item2'],
  damage: 2,
  level: 1,
  grade: 'common',
};
const enemy3: Enemy = {
  name: 'Skeleton Archer',
  id: uuid.v4().toString(),
  currentHealth: SKELETON_ARCHER_BASE_HEALTH,
  maxHealth: SKELETON_ARCHER_BASE_HEALTH,
  initiative: 3,
  loot: ['item1', 'item2'],
  damage: 2,
  level: 3,
  grade: 'common',
};
const enemy4: Enemy = {
  name: 'Skeleton Archer',
  id: uuid.v4().toString(),
  currentHealth: SKELETON_ARCHER_BASE_HEALTH,
  maxHealth: SKELETON_ARCHER_BASE_HEALTH,
  initiative: 3,
  loot: ['item1', 'item2'],
  damage: 2,
  level: 2,
  grade: 'common',
};
const enemy5: Enemy = {
  name: 'Skeleton Archer',
  id: uuid.v4().toString(),
  currentHealth: SKELETON_ARCHER_BASE_HEALTH,
  maxHealth: SKELETON_ARCHER_BASE_HEALTH,
  initiative: 3,
  loot: ['item1', 'item2'],
  damage: 2,
  level: 2,
  grade: 'common',
};

const enemy6: Enemy = {
  name: 'Skeleton Archer',
  id: uuid.v4().toString(),
  currentHealth: SKELETON_ARCHER_BASE_HEALTH,
  maxHealth: SKELETON_ARCHER_BASE_HEALTH,
  initiative: 3,
  loot: ['item1', 'item2'],
  damage: 2,
  level: 2,
  grade: 'common',
};
const enemy7: Enemy = {
  name: 'Skeleton Archer',
  id: uuid.v4().toString(),
  currentHealth: SKELETON_ARCHER_BASE_HEALTH,
  maxHealth: SKELETON_ARCHER_BASE_HEALTH,
  initiative: 3,
  loot: ['item1', 'item2'],
  damage: 2,
  level: 2,
  grade: 'common',
};

function Town({ navigation, route }: HomeStackScreenProps<'Town'>) {
  const player = usePlayerStore((state) => state.player);
  const removePlayer = usePlayerStore((state) => state.removePlayer);
  const fullyHealPlayer = usePlayerStore((state) => state.fullyHealPlayer);
  const resetAP = usePlayerStore((state) => state.resetAP);

  const { navigate } = navigation;

  const {
    setCurrentBattle,
    initBattle,
    currentBattle,
    getCurrentBattle,
    endBattle,
  } = useGameManagerStore((state) => ({
    getCurrentBattle: state.getCurrentBattle,
    setCurrentBattle: state.setCurrentBattle,
    initBattle: state.initBattle,
    currentBattle: state.currentBattle,
    endBattle: state.endBattle,
  }));

  const newBattle: Battle = {
    enemies: [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7],
    player: player!,
    log: [],
  };

  const handleBattleStart = () => {
    //Init battle
    setCurrentBattle(newBattle);

    initBattle();

    resetAP();
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
      {/* Healthbar */}
      <View>
        <Text className='text-2xl font-semibold text-white'>
          Health:{' '}
          <Text className='text-3xl text-red-500'>
            {player?.currentHealth}/{player?.maxHealth}
          </Text>
        </Text>
      </View>
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
      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={fullyHealPlayer}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          Full heal
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default Town;
