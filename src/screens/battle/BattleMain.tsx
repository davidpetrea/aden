import { Text, Pressable, View, ScrollView, Alert } from 'react-native';
import { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameManagerStore } from '../../stores/gameManagerStore';
import { BattleStackScreenProps } from '../../navigation/types';
import PlayerPanel from 'components/battle/playerPanel/PlayerPanel';

const PLAYER_ID = 'player_id';

function BattleMain({
  navigation,
  route,
}: BattleStackScreenProps<'BattleMain'>) {
  const player = usePlayerStore((state) => state.player);
  const damagePlayer = usePlayerStore((state) => state.damagePlayer);
  const healPlayer = usePlayerStore((state) => state.healPlayer);
  const resetAP = usePlayerStore((state) => state.resetAP);

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
  const damageEnemyById = useGameManagerStore((state) => state.damageEnemyById);
  const endBattle = useGameManagerStore((state) => state.endBattle);
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

  const handleEndBattle = () => {
    if (currentBattle) endBattle();
  };

  //TODO: handlePlayerAction - based on type : attack / skill / item
  const handleEnemyDamage = (enemyId: string) => {
    const result = damageEnemyById(enemyId, player?.damage ?? 0);

    if (result) {
      if (result.logEntry) addToBattleLog(result.logEntry);

      if (result.isDead) {
        //Handle enemy death
        handleEnemyDeath(enemyId);

        if (result.isLastEnemy) {
          handleBattleWin();
        }
      }
      nextTurn();
    }
  };

  const handleDefeatEndBattle = () => {
    handleEndBattle();

    const halfPlayerHp = (player?.maxHealth! / 2).toString();
    healPlayer(parseInt(halfPlayerHp));
  };

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

  return (
    <SafeAreaView className='flex-1 items-center bg-neutral-900  justify-between'>
      <Text className='text-xl text-white font-bold'>Battle Screen</Text>
      <Text className='text-base text-white font-semibold'>
        Current round: {currentBattle?.roundCounter}
      </Text>
      <Text className='text-base text-white font-semibold'>
        Current turn: {currentBattle?.currentTurnEntity?.name}
      </Text>
      {/* Enemies */}
      <View className='my-2 flex-row flex-wrap w-full justify-center'>
        {currentBattle?.enemies.map((enemy) => (
          <Pressable
            className={`bg-neutral-800 font-bold p-4 rounded-lg border w-[30%] mr-2 mb-2 ${
              enemy.currentHealth === 0
                ? 'border-red-500'
                : currentBattle?.currentTurnEntity?.id === enemy.id
                ? 'border-gray-100'
                : 'border-green-500'
            }`}
            key={enemy.id}
            onPress={() => handleEnemyDamage(enemy.id)}
            disabled={
              enemy.currentHealth === 0 ||
              !isOngoing ||
              isDefeat ||
              !isPlayerTurn
            }
          >
            <Text className='text-white text-lg'>{enemy.name}</Text>
            <Text className='text-lg text-white font-semibold'>
              Health:
              <Text className='font-bold test-base text-red-500'>
                {enemy.currentHealth}/{enemy.maxHealth}
              </Text>
            </Text>
          </Pressable>
        ))}
      </View>
      {/* Queue */}
      <View className='m-2 flex w-full mb-2 p-2 border border-slte-700py-2 rounded-2xl'>
        <Text className='text-white mb-2'>Queue:</Text>
        <View className='flex-row flex-wrap'>
          {currentBattle?.currentRoundOrder?.map((entity) => (
            <Text
              key={entity.id}
              className={`text-white text-lg mr-2 mb-2 bg-gray-700 rounded-xl p-1 px-2 border border-transparent ${
                currentBattle.currentTurnEntity?.id === entity.id
                  ? 'border-gray-100'
                  : ''
              }`}
            >
              {entity.name}
            </Text>
          ))}
        </View>
      </View>
      {/* Battle log */}
      <View className='mx-4 w-full'>
        <ScrollView
          ref={scrollViewRef}
          className='bg-neutral-800 rounded-md h-[200px] mx-2'
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

      {currentBattle?.currentTurnEntity?.id === 'player_id' && isOngoing && (
        <Text className='text-xl font-semibold text-gray-200'>
          Your turn! Select your skill and then tap on the target enemies.
        </Text>
      )}

      {currentBattle?.isDefeat && (
        <>
          <Text className='text-3xl text-red-500'>Battle lost...</Text>
          <Pressable
            className={`bg-neutral-800 font-bold p-4 rounded-lg w-2/3 transition duration-200 ease-in-out`}
            onPress={handleDefeatEndBattle}
          >
            <Text className='text-slate-50 font-[600] text-center uppercase font-[Josefin-Sans]'>
              Return to town
            </Text>
          </Pressable>
        </>
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
