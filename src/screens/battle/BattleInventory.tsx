import { Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameManagerStore } from '../../stores/gameManagerStore';
import { BattleStackScreenProps } from 'src/navigation/types';

function BattleInventory({
  navigation,
  route,
}: BattleStackScreenProps<'BattleInventory'>) {
  const currentBattle = useGameManagerStore((state) => state.currentBattle);
  const endBattle = useGameManagerStore((state) => state.endBattle);

  if (!currentBattle) {
    return null;
  }

  return (
    <SafeAreaView className='flex-1 gap-y-4 items-center bg-neutral-900 p-4'>
      <Text>Inventory</Text>
      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={() => {
          endBattle();
        }}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          End battle
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default BattleInventory;
