import {
  Text,
  Pressable,
  View,
  ScrollView,
  Alert,
  FlatList,
  BackHandler,
} from 'react-native';
import { useEffect, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PLAYER_ID, usePlayerStore } from '../../stores/playerStore';
import { Enemy, useGameManagerStore } from '../../stores/gameManagerStore';
import { BattleStackScreenProps } from '../../navigation/types';
import PlayerPanel from 'components/battle/playerPanel/PlayerPanel';
import EnemyCard from 'components/battle/enemy/EnemyCard';
import { useFocusEffect } from '@react-navigation/native';
import { Skill } from 'src/skills/skills';

function BattleMain({
  navigation,
  route,
}: BattleStackScreenProps<'BattleMain'>) {
  const player = usePlayerStore((state) => state.player);
  const damagePlayer = usePlayerStore((state) => state.damagePlayer);
  const healPlayer = usePlayerStore((state) => state.healPlayer);
  const resetAP = usePlayerStore((state) => state.resetAP);
  const decrementActiveCooldowns = usePlayerStore(
    (state) => state.decrementActiveCooldowns
  );

  const currentBattle = useGameManagerStore((state) => state.currentBattle);
  const currentTurnEntity = useGameManagerStore(
    (state) => state.currentBattle?.currentTurnEntity
  );
  const currentRoundOrder = useGameManagerStore(
    (state) => state.currentBattle?.currentRoundOrder
  );
  const isOngoing = useGameManagerStore(
    (state) => state.currentBattle?.isOngoing
  );
  const isDefeat = useGameManagerStore(
    (state) => state.currentBattle?.isDefeat
  );

  const addToBattleLog = useGameManagerStore((state) => state.addToBattleLog);
  const nextTurn = useGameManagerStore((state) => state.nextTurn);
  const endBattle = useGameManagerStore((state) => state.endBattle);

  const castMultipleTargetEnemySkill = useGameManagerStore(
    (state) => state.castMultipleTargetEnemySkill
  );

  const resetSkillCooldowns = usePlayerStore(
    (state) => state.resetSkillCooldowns
  );
  const updateSkillOnCast = usePlayerStore((state) => state.updateSkillOnCast);
  const handleCurrentEnemyAction = useGameManagerStore(
    (state) => state.handleCurrentEnemyAction
  );
  const handlePlayerDeath = useGameManagerStore(
    (state) => state.handlePlayerDeath
  );
  const handleEnemyDeath = useGameManagerStore(
    (state) => state.handleEnemyDeath
  );

  const handleBattleWin = useGameManagerStore((state) => state.handleBattleWin);

  const scrollViewRef = useRef<ScrollView>(null);
  const { navigate } = navigation;

  const handleEndBattle = () => {
    if (currentBattle) {
      endBattle();
      resetAP();
      resetSkillCooldowns();
    }
  };

  const handleDefeatEndBattle = () => {
    handleEndBattle();

    const halfPlayerHp = (player?.maxHealth! / 2).toString();
    healPlayer(parseInt(halfPlayerHp));
  };

  const handlePlayerEndTurn = () => {
    resetAP();
    decrementActiveCooldowns();
    nextTurn();
  };

  const handleTargetSelf = () => {};
  const isPlayerTurn = currentTurnEntity?.id === PLAYER_ID;
  //Main battle loop
  useEffect(() => {
    let timer: NodeJS.Timer;
    if (!player) return;

    //Enemy turn
    if (isOngoing && !isPlayerTurn) {
      timer = setTimeout(() => {
        const result = handleCurrentEnemyAction();

        if (result) {
          //If enemy damaged player
          if (result.playerDamage) {
            damagePlayer(result.playerDamage);
            addToBattleLog(
              `${player?.name} took ${result.playerDamage} DMG from ${result.enemyName}.`
            );

            //check if player dead
            if (player?.currentHealth - result.playerDamage <= 0) {
              handlePlayerDeath();
              Alert.alert(
                'You died!',
                'Luckily, you somehow wake up back in town.',
                [
                  {
                    text: 'Wake up',
                    onPress: () => handleDefeatEndBattle(),
                    style: 'cancel',
                  },
                ]
              );
            }
          }
        }

        nextTurn();
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentTurnEntity, currentRoundOrder, player, isOngoing, isPlayerTurn]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        //TODO: prompt user if sure that he wants to exit battle

        handleEndBattle();
        //navigate to town
        navigate('Main', {
          screen: 'Home',
          params: {
            screen: 'Town',
          },
        });

        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  if (!player) return null;

  const hasEnoughAPForSelectedSkill =
    player?.skills.selected.baseAPCost <= player?.currentAP;

  const handleMultipleTargetPlayerSkill = (skill: Skill) => {
    //Check if skill on cooldown
    if (skill.activeCooldown) return;

    //Check if player has enough AP
    if (player.currentAP < skill.baseAPCost) return;

    const result = castMultipleTargetEnemySkill(skill);

    if (result) {
      if (result.logEntries) {
        result.logEntries.forEach((logEntry) => addToBattleLog(logEntry));
      }

      if (result.killedEnemies?.length) {
        result.killedEnemies.forEach((killedEnemy) =>
          handleEnemyDeath(killedEnemy.id)
        );
      }

      if (result.wasLastEnemy) {
        handleBattleWin();
        resetSkillCooldowns();
      }
    }

    updateSkillOnCast(skill);
  };

  return (
    <SafeAreaView className='flex-1 items-center bg-neutral-900 justify-between'>
      <Text className='text-xl text-gray-200 font-semibold '>
        Current turn: {currentBattle?.currentTurnEntity?.name} &middot;{' '}
        <Text className='text-base text-gray-300 font-semibold'>
          Round: {currentBattle?.roundCounter}
        </Text>
      </Text>
      {/* Enemies */}
      <FlatList
        data={currentBattle?.enemies}
        renderItem={({ item }: { item: Enemy }) => (
          <EnemyCard enemy={item} handleSelect={() => console.log('123')} />
        )}
        keyExtractor={(item) => item.id}
        className='my-2 w-full max-h-[35%] border-b border-stone-700'
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
        }}
        numColumns={2}
      />

      {/* Battle log */}
      <View className='mx-4 mb-4 w-full flex-1'>
        <ScrollView
          ref={scrollViewRef}
          className='bg-neutral-800 rounded-md mx-2'
          contentContainerStyle={{ padding: 8 }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {currentBattle?.log.map((entry) => (
            <Text
              key={entry.id}
              className='text-base text-white font-semibold'
            >{`${entry.content}`}</Text>
          ))}
        </ScrollView>
      </View>
      {isPlayerTurn && isOngoing && (
        <View className=' w-full items-center my-4'>
          <Text className='text-lg font-semibold text-gray-200 mb-1'>
            Your turn! Select your skill and then tap on the target enemies.
          </Text>

          <View className='w-full items-center flex-row justify-center'>
            {/* Selected skill button */}
            {player?.skills.selected.targetType === 'self' && (
              <Pressable
                className={`bg-purple-700 w-1/3 p-2 rounded-lg mr-8 ${
                  !hasEnoughAPForSelectedSkill ? 'opacity-50' : ''
                }`}
                onPress={handleTargetSelf}
                style={{ elevation: 4 }}
                disabled={!hasEnoughAPForSelectedSkill}
              >
                <Text className='text-center font-bold text-gray-200 text-lg'>
                  Cast {player?.skills.selected.name} on yourself.
                </Text>
              </Pressable>
            )}
            {player?.skills.selected.targetCountType === 'multiple' && (
              <Pressable
                className={`bg-purple-700 w-1/3 p-2 rounded-lg mr-8 ${
                  !hasEnoughAPForSelectedSkill ? 'opacity-50' : ''
                }`}
                onPress={() =>
                  handleMultipleTargetPlayerSkill(player.skills.selected)
                }
                style={{ elevation: 4 }}
                disabled={!hasEnoughAPForSelectedSkill}
              >
                <Text className='text-center font-bold text-gray-200 text-lg'>
                  Cast {player?.skills.selected.name}
                </Text>
                <Text className='text-center text-base font-bold text-gray-300'>
                  {currentBattle?.selectedEnemies?.length ?? 0}/
                  {player.skills.selected.maxTargetCount} enemies selected
                </Text>
              </Pressable>
            )}

            <Pressable
              className='bg-stone-600 w-1/3 p-2 rounded-lg'
              onPress={handlePlayerEndTurn}
              style={{ elevation: 4 }}
            >
              <Text className='text-center font-bold text-gray-200 text-lg'>
                END TURN
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {currentBattle?.isWon && (
        <>
          <Text className='text-3xl text-red-300'>Battle won!!!</Text>
          <Pressable
            className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
            onPress={handleEndBattle}
          >
            <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
              Return to town
            </Text>
          </Pressable>
        </>
      )}
      <View className='self-end bg-red-300 max-h-[30%]'>
        <PlayerPanel />
      </View>
    </SafeAreaView>
  );
}

export default BattleMain;
