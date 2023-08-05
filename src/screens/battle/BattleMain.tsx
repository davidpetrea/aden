import { Text, Pressable, View, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../stores/playerStore';
import { useGameManagerStore } from '../../stores/gameManagerStore';
import { BattleStackScreenProps } from '../../navigation/types';
import PlayerPanel from 'components/battle/playerPanel/PlayerPanel';

function BattleMain({
  navigation,
  route,
}: BattleStackScreenProps<'BattleMain'>) {
  const player = usePlayerStore((state) => state.player);
  const damagePlayer = usePlayerStore((state) => state.damagePlayer);
  const healPlayer = usePlayerStore((state) => state.healPlayer);

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

  const isPlayerTurn = currentTurnEntity?.id === 'player_id';
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
    <SafeAreaView className='flex-1 gap-y-4 items-center bg-neutral-900'>
      <Text className='text-xl text-white font-bold'>Battle Screen</Text>
      <Text className='text-base text-white font-semibold'>
        Current turn: {currentBattle?.currentTurnEntity?.name}
      </Text>
      {/* Enemies */}
      <View className='my-4 flex-row flex-wrap w-full justify-center'>
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
      <View className='my-4 flex w-full gap-x-2 mb-2 border border-gray-300 py-2 rounded-2xl'>
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
      <ScrollView
        className='my-4 w-full gap-x-2 bg-gray-500 rounded-md max-h-[300px]'
        contentContainerStyle={{ padding: 8 }}
      >
        {currentBattle?.log.map((entry) => (
          <Text
            key={entry.id}
            className='text-base text-white font-semibold'
          >{`${entry.content}`}</Text>
        ))}
      </ScrollView>
      {currentBattle?.currentTurnEntity?.id === 'player_id' && isOngoing && (
        <Text className='text-xl font-semibold text-green-300'>
          Player turn is NOW!
        </Text>
      )}
      {/* Player stats */}
      <View>
        <Text className='text-2xl font-semibold text-white'>
          Health:{' '}
          <Text className='text-3xl text-red-500'>
            {player?.currentHealth}/{player?.maxHealth}
          </Text>
        </Text>
      </View>
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
      <PlayerPanel />
    </SafeAreaView>
  );
}

export default BattleMain;
