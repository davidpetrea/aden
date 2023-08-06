import { Pressable, View, Text } from 'react-native';
import { Enemy, useGameManagerStore } from '../../../stores/gameManagerStore';
import HealthBar from '../HealthBar';
import { PLAYER_ID, usePlayerStore } from '../../../stores/playerStore';
import CheckIcon from '../../../../assets/svg/check.svg';
import { Skill } from 'src/skills/skills';

const EnemyCard = ({
  enemy,
  handleSelect,
}: {
  enemy: Enemy;
  handleSelect: any;
}) => {
  //TODO: Display level color depending on player-enemy level difference

  const player = usePlayerStore((state) => state.player);
  const currentBattle = useGameManagerStore((state) => state.currentBattle);
  const handleSelectEnemies = useGameManagerStore(
    (state) => state.handleSelectEnemies
  );
  const castSingleTargetEnemySkill = useGameManagerStore(
    (state) => state.castSingleTargetEnemySkill
  );
  const addToBattleLog = useGameManagerStore((state) => state.addToBattleLog);
  const handleEnemyDeath = useGameManagerStore(
    (state) => state.handleEnemyDeath
  );
  const handleBattleWin = useGameManagerStore((state) => state.handleBattleWin);
  const resetSkillCooldowns = usePlayerStore(
    (state) => state.resetSkillCooldowns
  );
  const castSelfSkill = usePlayerStore((state) => state.castSelfSkill);
  const updateSkillOnCast = usePlayerStore((state) => state.updateSkillOnCast);
  //All hooks should go above this line
  if (!player || !currentBattle) return null;

  const selectedSkill = player.skills.selected;

  const isPlayerTurn = currentBattle.currentTurnEntity?.id === PLAYER_ID;

  const playerIsSelectingTargets =
    isPlayerTurn && selectedSkill.targetCountType === 'multiple';

  const isDead = enemy.currentHealth <= 0;

  const isSelected = currentBattle.selectedEnemies?.some(
    (selectedEnemy) => selectedEnemy.id === enemy.id
  );

  const maxTargetsSelected =
    selectedSkill.targetCountType === 'multiple' &&
    currentBattle.selectedEnemies?.length ===
      player.skills.selected.maxTargetCount;

  const isCurrentTurn = currentBattle.currentTurnEntity?.id === enemy.id;

  const handleSingleTargetPlayerSkill = (targetId: string, skill: Skill) => {
    //Check if skill on cooldown
    if (skill.activeCooldown) return;

    //Check if player has enough AP
    if (player?.currentAP < skill.baseAPCost) return;

    const result = castSingleTargetEnemySkill(targetId, skill);

    if (result) {
      if (result.logEntry) addToBattleLog(result.logEntry);
      if (result.hasBeenKilled) {
        //Handle enemy death
        handleEnemyDeath(targetId);
      }

      if (result.wasLastEnemy) {
        handleBattleWin();
        resetSkillCooldowns();
      }

      updateSkillOnCast(skill);
    }
  };

  return (
    <Pressable
      key={enemy.id}
      onPress={() =>
        selectedSkill.targetCountType === 'multiple'
          ? handleSelectEnemies(enemy.id, selectedSkill)
          : handleSingleTargetPlayerSkill(enemy.id, selectedSkill)
      }
      className={`p-2 rounded-lg m-1 bg-stone-700 flex-[42%] relative border-2 border-transparent ${
        isCurrentTurn ? 'border-stone-950 bg-stone-500' : ''
      } ${isDead ? 'opacity-50' : ''}`}
      disabled={
        isDead ||
        (maxTargetsSelected && !isSelected) ||
        !isPlayerTurn ||
        selectedSkill.targetType !== 'enemy' ||
        !!selectedSkill.activeCooldown ||
        (selectedSkill.baseAPCost > 0 && player.currentAP === 0)
      }
    >
      <Text className='text-rose-400 text-base font-bold mb-1'>
        {enemy.name} &middot;{' '}
        <Text className='text-gray-200 mx-1'>Lv. {enemy.level} </Text>&middot;{' '}
        <Text className='text-gray-200 text-sm capitalize'>{enemy.grade}</Text>
      </Text>
      <HealthBar entity={enemy} size='sm' />
      <View className='border-t border-stone-900 my-1'>
        <Text className='font-semibold text-gray-300'>Statuses: </Text>
      </View>
      {playerIsSelectingTargets && !isDead && (
        <View
          className={`absolute right-1 top-1 rounded-md border-2 border-purple-500 w-5 h-5 justify-center items-center ${
            maxTargetsSelected && !isSelected && 'opacity-50'
          }`}
        >
          {isSelected && <CheckIcon fill='#a855f7' width={24} height={24} />}
        </View>
      )}
    </Pressable>
  );
};

export default EnemyCard;
