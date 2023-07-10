import { Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserStore } from '../../stores/userStore';

function Home() {
  const { character, removeCharacter } = useUserStore();

  return (
    <SafeAreaView className='flex-1 gap-y-4 items-center justify-center bg-neutral-900 p-4'>
      <Text className='text-slate-50'>Welcome back, {character?.name}!</Text>
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
