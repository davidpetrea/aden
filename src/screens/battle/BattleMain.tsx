import { Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameManagerStore } from '../../stores/gameManagerStore';
import { BattleStackScreenProps } from '../../navigation/types';

function BattleMain({
  navigation,
  route,
}: BattleStackScreenProps<'BattleMain'>) {
  const currentBattle = useGameManagerStore((state) => state.currentBattle);
  const damageEnemyById = useGameManagerStore((state) => state.damageEnemyById);
  const endBattle = useGameManagerStore((state) => state.endBattle);

  const handleEndBattle = () => {
    if (currentBattle) endBattle();
  };

  const handleEnemyDamage = (enemyId: string) => {
    damageEnemyById(enemyId, 2);
  };

  return (
    <SafeAreaView className='flex-1 gap-y-4 items-center bg-neutral-900 p-4'>
      <Text className='text-xl text-white font-bold'>Battle Screen</Text>
      <View className='my-4 flex-row w-full gap-x-2'>
        {currentBattle?.enemies.map((enemy) => (
          <Pressable
            className={`bg-neutral-800 font-bold p-4 rounded-lg border ${
              enemy.health === 0 ? 'border-red-500' : 'border-green-500'
            }`}
            key={enemy.id}
            onPress={() => handleEnemyDamage(enemy.id)}
            disabled={enemy.health === 0}
          >
            <Text className='text-white text-lg'>Enemy: {enemy.id}</Text>
            <Text className='text-white text-lg'>Health: {enemy.health}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={handleEndBattle}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          End battle
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default BattleMain;
