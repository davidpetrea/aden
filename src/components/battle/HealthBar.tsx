import { View, StyleSheet, Text } from 'react-native';
import { Entity } from 'src/stores/gameManagerStore';

type HealthBarSizes = 'sm' | 'base';

const HealthBar = ({
  entity,
  size = 'base',
}: {
  entity: Entity;
  size?: HealthBarSizes;
}) => {
  const healthFillWidth = parseInt(
    ((entity.currentHealth / entity.maxHealth) * 100).toFixed(0)
  );

  const HPTextSize = size === 'base' ? 'text-2xl' : 'text-base';
  const barHeight = size === 'base' ? 'h-8' : 'h-6';
  const redBarHeight = size === 'base' ? 'h-4' : 'h-3';
  const HPNumberSize = size === 'base' ? 'text-lg' : 'text-sm';

  return (
    <View className='flex-row w-full items-start'>
      <View className='flex-1 items-end'>
        <View className='flex-row items-center'>
          <View className='mr-2 '>
            <Text className={`${HPTextSize} font-bold text-gray-200`}>HP</Text>
          </View>
          <View
            className={`bg-neutral-900 ${barHeight} flex-row items-center rounded-xl justify-center px-2 flex-1`}
          >
            <View className='flex-1 mr-2'>
              <View
                style={{ width: `${healthFillWidth}%`, elevation: 3 }}
                className={`bg-rose-500 ${redBarHeight} rounded-lg`}
              ></View>
            </View>

            <View className='border-l border-neutral-800 pl-2 my-0.5'>
              <Text className={`${HPNumberSize} font-bold text-rose-500`}>
                {entity.currentHealth}/{entity.maxHealth}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default HealthBar;
