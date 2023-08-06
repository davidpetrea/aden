import { View, Text, Pressable, ScrollView } from 'react-native';
import { PLAYER_ID, usePlayerStore } from '../../../stores/playerStore';
import { useGameManagerStore } from '../../../stores/gameManagerStore';

const SkillsContainer = () => {
  const player = usePlayerStore((state) => state.player);
  const selectSkill = usePlayerStore((state) => state.selectSkill);
  const currentBattle = useGameManagerStore((state) => state.currentBattle);
  const clearSelectedEnemies = useGameManagerStore(
    (state) => state.clearSelectedEnemies
  );

  if (!player || !currentBattle) return null;

  const isPlayerTurn = currentBattle.currentTurnEntity?.id === PLAYER_ID;

  return (
    <ScrollView
      className='bg-neutral-800 border-y border-stone-950 w-4/5 flex-row'
      horizontal
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {player.skills.equipped.map((skill) => {
        const Icon = skill.icon;

        const isSelected = player.skills.selected.id === skill.id;

        const cooldown = skill.activeCooldown ?? 0;

        const canCast = skill.baseAPCost <= player.currentAP && !cooldown;

        return (
          <View
            className={`items-center p-2 ${!canCast ? 'opacity-60' : ''}`}
            key={skill.id}
          >
            <Pressable
              disabled={isSelected || !canCast || !isPlayerTurn}
              onPress={() => selectSkill(skill.id, clearSelectedEnemies)}
              className={`relative items-center justify-center rounded-md bg-stone-600 w-20 h-20 mx-2 border-[2px] border-transparent ${
                isSelected ? 'border-slate-200' : ''
              }`}
              style={{ elevation: 3 }}
            >
              {Icon({
                width: 64,
                height: 64,
              })}
              {cooldown !== 0 && (
                <View className='absolute bg-neutral-800 w-full h-full opacity-50 justify-center items-center'>
                  <Text className='text-4xl font-bold text-purple-500'>
                    {cooldown}
                  </Text>
                </View>
              )}
            </Pressable>
            <Text className='text-base font-bold text-gray-200'>
              {skill.name}
            </Text>
            <View className='flex-row items-center justify-center max-w-[60px]'>
              <Text className='text-base font-bold text-gray-200 mr-1'>
                Lv. {skill.level} &middot;
              </Text>

              <View className='bg-stone-900 w-6 h-6 rounded-full mx-1 justify-center items-center'>
                <View className='bg-purple-600 w-4 h-4 rounded-full mx-1'></View>
              </View>
              <Text className='text-base font-bold text-gray-400'>
                {skill.baseAPCost}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default SkillsContainer;
