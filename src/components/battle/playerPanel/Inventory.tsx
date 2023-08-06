import { View, Pressable } from 'react-native';
import InventoryIcon from '../../../../assets/svg/inventory.svg';
import { useNavigation } from '@react-navigation/native';

const Inventory = () => {
  const { navigate } = useNavigation();

  return (
    <View className='w-1/5 border-t border-r border-b border-stone-950  bg-neutral-800'>
      <Pressable
        className=' justify-center items-center h-full'
        onPress={() =>
          navigate('Battle', {
            screen: 'BattleInventory',
          })
        }
      >
        <InventoryIcon
          fill='#a16207'
          width={80}
          height={80}
          stroke='black'
          strokeWidth={0.3}
          strokeOpacity={0.5}
        />
      </Pressable>
    </View>
  );
};

export default Inventory;
