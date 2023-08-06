import uuid from 'react-native-uuid';
import { create } from 'zustand';
import { PLAYER_ID, Player } from './playerStore';
import { Skill } from 'src/skills/skills';

export type Entity = {
  id: string;
  level: number;
  name: string;
  currentHealth: number;
  maxHealth: number;
  initiative: number;
  damage: number; //TODO: calculate this based on more stats/items
};

export type Enemy = Entity & {
  id: string;
  loot: string[];
  grade: 'common' | 'rare' | 'elite' | 'boss';
};

type LogEntry = {
  id: string;
  timestamp: Date;
  content: string;
};

export type Battle = {
  enemies: Enemy[];
  player: Player;
  isOngoing?: boolean;
  isDefeat?: boolean;
  isWon?: boolean;
  currentTurnEntity?: Entity;
  currentRoundOrder?: Entity[];
  log: LogEntry[];
  roundCounter?: number;
  selectedEnemies?: Entity[];
};

export type EnemyActionResult =
  | {
      playerDamage?: number;
      enemyName?: string;
    }
  | undefined;

export type PlayerAttackResult =
  | {
      hasBeenKilled?: boolean;
      wasLastEnemy?: boolean;
      logEntry?: string;
    }
  | undefined;

export type PlayerMultipleAttackResult =
  | {
      killedEnemies?: Enemy[];
      wasLastEnemy?: boolean;
      logEntries?: string[];
    }
  | undefined;

interface GameManagerState {
  currentBattle?: Battle;
  setCurrentBattle: (battle: Battle) => void;
  getCurrentBattle: () => void;
  initBattle: () => void;
  endBattle: () => void;
  setCurrentTurnEntity: (entity: Entity) => void;
  addToBattleLog: (action: string) => void;
  nextTurn: () => void;
  clearSelectedEnemies: () => void;
  handleCurrentEnemyAction: () => EnemyActionResult;
  handlePlayerDeath: () => void;
  handleEnemyDeath: (enemyId: string) => void;
  handleBattleWin: () => void;
  handleSelectEnemies: (enemyId: string, selectedSkill: Skill) => void;
  castSingleTargetEnemySkill: (
    targetId: string,
    skill: Skill
  ) => PlayerAttackResult;
  castMultipleTargetEnemySkill: (
    selectedSkill: Skill
  ) => PlayerMultipleAttackResult;
}

export const useGameManagerStore = create<GameManagerState>()((set, get) => ({
  currentBattle: undefined,
  setCurrentBattle: (battle: Battle) => {
    set({
      currentBattle: battle,
    });
  },
  getCurrentBattle: () => {
    return get().currentBattle;
  },
  initBattle: () => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    //Calculate round order depending on entity initiative
    const initialRoundOrder = [
      currentBattle.player,
      ...currentBattle.enemies,
    ].sort((a, b) => a.initiative - b.initiative);
    console.log('Battle has started!');
    set({
      currentBattle: {
        ...currentBattle,
        isOngoing: true,
        roundCounter: 1,
        currentRoundOrder: initialRoundOrder,
        currentTurnEntity: initialRoundOrder[0],
        selectedEnemies: [],
      },
    });
  },
  endBattle: () => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    console.log('Battle has ended!');
    set({
      currentBattle: undefined,
    });
  },
  setCurrentTurnEntity: (entity) => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    console.log('Setting first entity turn...', entity);
    set({
      currentBattle: {
        ...currentBattle,
        currentTurnEntity: entity,
      },
    });
  },
  addToBattleLog: (action) => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    const now = new Date();
    const newId = uuid.v4().toString();

    set({
      currentBattle: {
        ...currentBattle,
        log: [
          ...currentBattle.log,
          {
            id: newId,
            timestamp: now,
            content: action,
          },
        ],
      },
    });
  },
  handleCurrentEnemyAction: () => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    const currentEnemy = currentBattle.currentTurnEntity;

    const actionType = 'damage_player';

    //TODO: maybe emit some kind of event to update playerStore?
    return {
      playerDamage: actionType === 'damage_player' ? currentEnemy?.damage : 0,
      enemyName: currentEnemy?.name ?? undefined,
    };
  },
  nextTurn: () => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    let resetSelectedEnemies = false;
    //If player just ended his turn, empty selected enemies
    if (currentBattle.currentTurnEntity?.id === PLAYER_ID) {
      resetSelectedEnemies = true;
    }

    const prevOrder = currentBattle.currentRoundOrder;
    const prevEntity = currentBattle.currentTurnEntity;

    if (!prevEntity) return; //TODO:test this

    const newCurrentRoundOrder = prevOrder?.slice(1)!;

    //If last turn in this round, setup nextRound
    if (!newCurrentRoundOrder.length) {
      // Recalculate order for next round
      const nextRoundOrder = [currentBattle.player, ...currentBattle.enemies]
        .filter((entity) => entity.currentHealth > 0)
        .sort((a, b) => a.initiative - b.initiative);

      //TODO: Handle abilities cooldown for alive entities
      //TODO: Do anything round end/start related here

      set({
        currentBattle: {
          ...currentBattle,
          currentRoundOrder: nextRoundOrder,
          currentTurnEntity: nextRoundOrder[0],
          roundCounter: currentBattle.roundCounter! + 1,
          selectedEnemies: resetSelectedEnemies
            ? []
            : currentBattle.selectedEnemies,
        },
      });
    } else {
      set({
        currentBattle: {
          ...currentBattle,
          currentRoundOrder: newCurrentRoundOrder,
          currentTurnEntity: newCurrentRoundOrder[0],
          selectedEnemies: resetSelectedEnemies
            ? []
            : currentBattle.selectedEnemies,
        },
      });
    }
  },
  handleEnemyDeath: (enemyId) => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    //Remove from queue
    const prevOrder = currentBattle.currentRoundOrder;

    const newRoundOrder = prevOrder?.filter((entity) => entity.id !== enemyId);

    if (!newRoundOrder) return;

    const prevEntity = currentBattle.currentTurnEntity;

    let currentTurnEntityDied = false;
    if (prevEntity?.id === enemyId) {
      currentTurnEntityDied = true;
    }

    //If current entity is the one that got killed, replace with next in queue after pop
    set({
      currentBattle: {
        ...currentBattle,
        currentRoundOrder: newRoundOrder,
        currentTurnEntity: currentTurnEntityDied
          ? newRoundOrder[0]
          : currentBattle.currentTurnEntity,
      },
    });
  },
  handlePlayerDeath: () => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;
    set({
      currentBattle: {
        ...currentBattle,
        isOngoing: false,
        isDefeat: true,
      },
    });
  },
  castSingleTargetEnemySkill: (targetId, skill) => {
    //All checks should be already done before calling this action
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    const enemy = currentBattle.enemies.find((enemy) => enemy.id === targetId);

    if (!enemy) return;

    const isDead = enemy.currentHealth <= 0;

    if (isDead) return;

    //Calculate skill damage
    //TODO: Complete skill/damage system which includes armor/magic resists, elements, etc.
    const damage = skill.baseDamage;

    const updatedEnemies = currentBattle.enemies.map((enemy) => {
      if (enemy.id === targetId) {
        return {
          ...enemy,
          currentHealth: Math.max(enemy.currentHealth - damage, 0),
        };
      }

      return enemy;
    });

    const hasBeenKilled = enemy.currentHealth - damage <= 0;
    const wasLastEnemy =
      hasBeenKilled &&
      updatedEnemies.filter((enemy) => enemy.currentHealth > 0).length === 0;

    set({
      currentBattle: {
        ...currentBattle,
        enemies: updatedEnemies,
      },
    });

    return {
      hasBeenKilled,
      wasLastEnemy,
      logEntry: `${enemy.name} got hit for ${damage} DMG by ${skill.name} ${
        hasBeenKilled ? ' and died' : '.'
      }`,
    };
  },
  castMultipleTargetEnemySkill: (skill) => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    const selectedEnemies = currentBattle.selectedEnemies;

    const selectedIds = selectedEnemies?.map(
      (selectedEnemy) => selectedEnemy.id
    );
    if (!selectedEnemies?.length) return;

    const damage = skill.baseDamage;

    const killedEnemies: Enemy[] = [];
    const logEntries: string[] = [];

    const updatedEnemies = currentBattle.enemies.map((enemy) => {
      if (selectedIds?.includes(enemy.id)) {
        const hasBeenKilled = enemy.currentHealth - damage <= 0;
        if (hasBeenKilled) {
          killedEnemies.push(enemy);
        }

        const logEntry = `${enemy.name} got hit for ${damage} DMG by ${
          skill.name
        } ${hasBeenKilled ? ' and died' : '.'}`;

        logEntries.push(logEntry);

        return {
          ...enemy,
          currentHealth: Math.max(enemy.currentHealth - damage, 0),
        };
      }

      return enemy;
    });

    const wasLastEnemy = !updatedEnemies.some(
      (enemy) => enemy.currentHealth > 0
    );

    set({
      currentBattle: {
        ...currentBattle,
        enemies: updatedEnemies,
      },
    });

    return {
      killedEnemies,
      logEntries,
      wasLastEnemy,
    };
  },
  handleBattleWin: () => {
    console.log('Battle won!');
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    console.log(
      'Looting:',
      currentBattle.enemies.map((enemy) => enemy.loot)
    );

    console.log('Battle has ended!');
    set({
      currentBattle: {
        ...currentBattle,
        isOngoing: false,
        isWon: true,
      },
    });
  },
  handleSelectEnemies: (enemyId, skill) => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;

    //Check if enemy is already selected
    const isSelected = currentBattle.selectedEnemies?.some(
      (selectedEnemy) => selectedEnemy.id === enemyId
    );

    const enemy = currentBattle.enemies.find((enemy) => enemy.id === enemyId);

    if (!enemy) return;

    //Check if skill can support multiple targets and has max targets defined
    if (skill.targetCountType !== 'multiple' || !skill.maxTargetCount) return;

    //Check if enemy is dead
    const isDead = enemy.currentHealth <= 0;
    const skillTargetAvailable =
      !isSelected &&
      currentBattle.selectedEnemies &&
      currentBattle.selectedEnemies?.length < skill.maxTargetCount;

    // Check if current skill target limit has been reached

    if (isSelected) {
      // Remove from selected []
      set({
        currentBattle: {
          ...currentBattle,
          selectedEnemies: currentBattle.selectedEnemies?.filter(
            (selectedEnemy) => selectedEnemy.id !== enemyId
          ),
        },
      });
    } else {
      // Do not select if dead or skill targets limits reached
      if (isDead || !skillTargetAvailable) return;
      //Add to selected []
      set({
        currentBattle: {
          ...currentBattle,
          selectedEnemies: [...currentBattle.selectedEnemies!, enemy],
        },
      });
    }
  },

  clearSelectedEnemies: () => {
    const currentBattle = get().currentBattle;

    if (!currentBattle) return;
    set({
      currentBattle: {
        ...currentBattle,
        selectedEnemies: [],
      },
    });
  },
}));
