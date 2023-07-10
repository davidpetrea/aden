import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserStore } from '../../stores/userStore';

function Home() {
  const { username } = useUserStore();
  console.log('Username', username);
  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-neutral-900 p-4'>
      <Text className='text-slate-50'>Welcome back, {username}!</Text>
    </SafeAreaView>
  );
}

export default Home;
