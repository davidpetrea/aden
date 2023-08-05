import { Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../stores/playerStore';

function Inventory() {
  const player = usePlayerStore((state) => state.player);

  return (
    <SafeAreaView className='flex-1 gap-y-4 items-center bg-neutral-900 p-4'>
      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={() => {
          console.log('Inventory log');
        }}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          Inventory
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default Inventory;
