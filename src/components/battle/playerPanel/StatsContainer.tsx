import { View, Text, Pressable } from 'react-native';
import { usePlayerStore } from '../../../stores/playerStore';
import { colors } from 'theme/colors';

const StatsContainer = () => {
  const player = usePlayerStore((state) => state.player);
  const consumeAP = usePlayerStore((state) => state.consumeAP);

  if (!player) return null;

  const expFillWidth = parseInt(
    ((player.currentExp / player.currentExpRequired) * 100).toFixed(0)
  );

  const healthFillWidth = parseInt(
    ((player.currentHealth / player.maxHealth) * 100).toFixed(0)
  );

  const actionPoints: boolean[] = [];
  actionPoints.length = player.maxAP;
  if (player.currentAP > 0) actionPoints.fill(true, 0, player.currentAP);
  actionPoints.fill(false, player.currentAP);

  return (
    <View className='bg-green-300 flex-row justify-between'>
      {/* Player info */}
      <View className='w-2/3 bg-neutral-800 '>
        <View className='flex-row justify-between p-2 w-full'>
          <View className='flex-row items-end'>
            <Text className='text-gray-200 font-bold text-3xl'>
              {player.name}
            </Text>
            <Text
              className={`text-[${
                colors[player?.specialization]
              }] font-bold capitalize ml-2 text-sm`}
            >
              {player.specialization}
            </Text>
          </View>
          {/* Lv. and exp bar */}
          <View className='flex-row w-2/3 items-start'>
            <View className='flex-1 items-end'>
              <View className='flex-row w-full px-2 justify-between items-end'>
                <Text className='text-2xl self-start font-bold text-gray-200 mr-2'>
                  Lv. {player.level}
                </Text>
                <Text className='text-gray-200 font-bold'>
                  {player.currentExp}/{player.currentExpRequired}
                </Text>
              </View>

              <View className='bg-neutral-900 h-6 w-full rounded-full flex justify-center px-2'>
                <View
                  style={{ width: `${expFillWidth}%`, elevation: 10 }}
                  className={`bg-green-300 h-3 rounded-full`}
                ></View>
              </View>
            </View>
          </View>
        </View>
        {/* Health bar */}
        <View className='p-2'>
          <View className='flex-row w-full items-start'>
            <View className='flex-1 items-end'>
              <View className='flex-row items-center'>
                <View className='mr-2 '>
                  <Text className='text-2xl font-bold text-gray-200'>HP</Text>
                </View>
                <View className='bg-neutral-900 h-8 flex-row items-center rounded-xl justify-center px-2 flex-1'>
                  <View className='flex-1'>
                    <View
                      style={{ width: `${healthFillWidth}%`, elevation: 10 }}
                      className={`bg-red-400 h-4 rounded-lg mr-2`}
                    ></View>
                  </View>

                  <View className='border-l border-neutral-800 pl-2 my-0.5'>
                    <Text className='text-lg font-bold text-red-400'>
                      {player.currentHealth}/{player.maxHealth}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Action points */}
        <View className='flex-row items-center mx-2'>
          <View className='mr-2 '>
            <Text className='text-2xl font-bold text-gray-200'>AP</Text>
          </View>
          <View className='p-2 flex-row gap-x-4'>
            {actionPoints.map((ap) => {
              if (ap)
                return (
                  <View className='rounded-full bg-neutral-900 w-8 h-8 flex justify-center items-center'>
                    <View className='bg-orange-400 rounded-full w-5 h-5'></View>
                  </View>
                );
              return (
                <View className='rounded-full bg-neutral-900 w-8 h-8'></View>
              );
            })}
          </View>
        </View>
      </View>
      {/* Buffs/Debufss */}
      <View className='w-1/3 bg-green-600 p-2'>
        <Text>Buffs/Debuffs</Text>
        <Pressable onPress={() => consumeAP(1)}>
          <Text>Consume AP</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default StatsContainer;
