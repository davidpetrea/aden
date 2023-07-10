import TextField from 'components/ui/TextField';
import { Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserStore } from '../../stores/userStore';

function NameSelect() {
  const { setUsername } = useUserStore();

  return (
    <SafeAreaView className='flex-1 gap-y-4 items-center justify-center bg-neutral-900 p-4'>
      <TextField label='Username' placeholder='Pick a username...' />
      <Pressable
        className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
        onPress={() => {
          setUsername('Halala');
        }}
      >
        <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
          Continue
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default NameSelect;
