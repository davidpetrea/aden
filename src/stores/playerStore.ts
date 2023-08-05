import AsyncStorage from '@react-native-async-storage/async-storage';

import { create } from 'zustand';
import { Entity } from './gameManagerStore';

//TODO: Find better way to config class defaults to make it more readable/scalable

export type CharacterClass = 'warrior' | 'mage';

enum PlayerStorageFields {
  'player' = 'player',
}

type ClassSpecificFields = Pick<
  Player,
  'maxHealth' | 'currentHealth' | 'initiative' | 'specialization'
>;

const playerDefaults: Omit<Player, keyof ClassSpecificFields | 'name'> = {
  level: 1,
  id: 'player_id',
  damage: 6, //TODO: calculate this based on stats and items,
  currentExp: 0,
  currentExpRequired: 250,
  currentAP: 4,
  maxAP: 4,
};

//TODO: proper class config
const WARRIOR_BASE_HEALTH = 44;
const MAGE_BASE_HEALTH = 32;

const warriorDefaults: ClassSpecificFields = {
  currentHealth: WARRIOR_BASE_HEALTH,
  maxHealth: WARRIOR_BASE_HEALTH,
  initiative: 10,
  specialization: 'warrior',
};
const mageDefaults: ClassSpecificFields = {
  currentHealth: MAGE_BASE_HEALTH,
  maxHealth: MAGE_BASE_HEALTH,
  initiative: 8,
  specialization: 'mage',
};

export type Player = Entity & {
  name: string;
  specialization: CharacterClass;
  level: number;
  currentExp: number;
  currentExpRequired: number;
  currentAP: number;
  maxAP: number;
};

interface PlayerState {
  player: Player | undefined;
  createPlayer: (
    data: Pick<Player, 'name' | 'specialization'>
  ) => Promise<void>;
  getPlayer: () => Promise<void>;
  setPlayer: (player: Player) => Promise<void>;
  removePlayer: () => Promise<void>;
  damagePlayer: (damage: number) => void;
  fullyHealPlayer: () => void;
  healPlayer: (amount: number) => void;
  consumeAP: (amount: number) => void;
  resetAP: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  player: undefined,
  getPlayer: async () => {
    try {
      const playerJson = await AsyncStorage.getItem(PlayerStorageFields.player);
      const player = playerJson ? JSON.parse(playerJson) : null;

      if (player) {
        set({ player });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  },
  createPlayer: async (data) => {
    if (!data) {
      throw new Error('Character could not be created due to invalid data.');
    }

    let newPlayer: Player;

    switch (data.specialization) {
      case 'warrior':
        newPlayer = {
          ...warriorDefaults,
          ...playerDefaults,
          name: data.name,
        };
        break;
      case 'mage':
        newPlayer = {
          ...mageDefaults,
          ...playerDefaults,
          name: data.name,
        };
        break;
    }

    await AsyncStorage.setItem(
      PlayerStorageFields.player,
      JSON.stringify({
        ...newPlayer,
      })
    );

    set({ player: newPlayer });
  },
  setPlayer: async (player) => {
    try {
      if (!player) {
        throw new Error('Player undefined or null.');
      }
      await AsyncStorage.setItem(
        PlayerStorageFields.player,
        JSON.stringify(player)
      );

      set({ player });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  },
  removePlayer: async () => {
    try {
      await AsyncStorage.removeItem(PlayerStorageFields.player);
      set({ player: undefined });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  },
  damagePlayer: (damage) => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;

    let isDead = currentPlayer.currentHealth - damage <= 0;

    set({
      player: {
        ...currentPlayer,
        currentHealth: isDead ? 0 : currentPlayer.currentHealth - damage,
      },
    });
  },
  fullyHealPlayer: () => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;
    set({
      player: {
        ...currentPlayer,
        currentHealth: currentPlayer.maxHealth,
      },
    });
  },
  healPlayer: (amount) => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;
    set({
      player: {
        ...currentPlayer,
        currentHealth: currentPlayer.currentHealth + amount,
      },
    });
  },
  consumeAP: (amount) => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;

    if (currentPlayer.currentAP < amount) return;

    set({
      player: {
        ...currentPlayer,
        currentAP: currentPlayer.currentAP - amount,
      },
    });
  },
  resetAP: () => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;

    set({
      player: {
        ...currentPlayer,
        currentAP: currentPlayer.maxAP,
      },
    });
  },
}));
