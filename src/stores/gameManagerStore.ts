import uuid from 'react-native-uuid';
import { create } from 'zustand';
import { Player } from './playerStore';

export type Entity = {
  id: string;
  name: string;
  currentHealth: number;
  maxHealth: number;
  initiative: number;
  damage: number; //TODO: calculate this based on more stats/items
};

export type Enemy = Entity & {
  id: string;
  loot: string[];
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
};

export type EnemyActionResult =
  | {
      playerDamage?: number;
      enemyName?: string;
    }
  | undefined;

export type PlayerAttackResult =
  | {
      isDead?: boolean;
      isLastEnemy?: boolean;
      logEntry?: string;
    }
  | undefined;

interface GameManagerState {
  currentBattle?: Battle;
  setCurrentBattle: (battle: Battle) => void;
  getCurrentBattle: () => void;
  initBattle: () => void;
  endBattle: () => void;
  setCurrentTurnEntity: (entity: Entity) => void;
  damageEnemyById: (enemyId: string, damage: number) => PlayerAttackResult;
  addToBattleLog: (action: string) => void;
  nextTurn: () => void;
  handleCurrentEnemyAction: () => EnemyActionResult;
  handlePlayerDeath: () => void;
  handleEnemyDeath: (enemyId: string) => void;
  handleBattleWin: () => void;
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
  damageEnemyById: (enemyId, damage) => {
    const currentBattle = get().currentBattle;
    if (!currentBattle) return;

    const enemy = currentBattle.enemies.filter(
      (enemy) => enemy.id === enemyId
    )[0];
    if (!enemy) return;

    let isDead = false;
    let isLastEnemy = false;

    const updatedEnemies = currentBattle.enemies.map((enemy) => {
      if (enemy.id === enemyId) {
        if (enemy.currentHealth - damage <= 0) {
          isDead = true;
        }
        return {
          ...enemy,
          currentHealth: isDead ? 0 : enemy.currentHealth - damage,
        };
      }

      return enemy;
    });

    if (isDead && !updatedEnemies.some((enemy) => enemy.currentHealth > 0)) {
      isLastEnemy = true;
    }

    set({
      currentBattle: {
        ...currentBattle,
        enemies: updatedEnemies,
      },
    });

    return {
      isDead,
      isLastEnemy,
      logEntry: `${enemy.name} got hit for ${damage} DMG${
        isDead ? ' and died' : '.'
      }`,
    };
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
        },
      });
    } else {
      set({
        currentBattle: {
          ...currentBattle,
          currentRoundOrder: newCurrentRoundOrder,
          currentTurnEntity: newCurrentRoundOrder[0],
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
}));
