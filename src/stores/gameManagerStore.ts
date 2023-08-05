import { create } from 'zustand';
import { Player } from './playerStore';

export type Entity = {
  health: number;
  initiative: number;
};

export type Enemy = Entity & {
  id: string;
  loot: string[];
};

export type Battle = {
  enemies: Enemy[];
  player: Player;
  isOngoing?: boolean;
  currentTurnEntity?: Entity;
  currentRoundOrder?: Entity[];
};

interface GameManagerState {
  currentBattle?: Battle;
  setCurrentBattle: (battle: Battle) => void;
  getCurrentBattle: () => void;
  initBattle: () => void;
  endBattle: () => void;
  setCurrentTurnEntity: (entity: Entity) => void;
  damageEnemyById: (enemyId: string, damage: number) => void;
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

    const enemy = currentBattle.enemies.filter((enemy) => enemy.id === enemyId);
    if (!enemy) return;

    console.log(`Damaging enemy ${enemyId} for ${damage} DMG.`);

    set({
      currentBattle: {
        ...currentBattle,
        enemies: currentBattle.enemies.map((enemy) => {
          if (enemy.id === enemyId) {
            return {
              ...enemy,
              health: enemy.health - damage < 0 ? 0 : enemy.health - damage,
            };
          }

          return enemy;
        }),
      },
    });
  },
}));
