import AsyncStorage from '@react-native-async-storage/async-storage';
import Character, { CharacterClass } from '../character';
import { create } from 'zustand';
import { Entity } from './gameManagerStore';

enum PlayerStorageFields {
  'player' = 'player',
}

type ClassSpecificFields = Pick<
  Player,
  'health' | 'initiative' | 'specialization'
>;

const playerDefaults: Omit<Player, keyof ClassSpecificFields | 'name'> = {
  level: 1,
};

const warriorDefaults: ClassSpecificFields = {
  health: 10,
  initiative: 10,
  specialization: 'warrior',
};
const mageDefaults: ClassSpecificFields = {
  health: 7,
  initiative: 8,
  specialization: 'mage',
};

export type Player = Entity & {
  name: string;
  specialization: CharacterClass;
  level: number;
};

interface PlayerState {
  player: Player | undefined;
  createPlayer: (
    data: Pick<Player, 'name' | 'specialization'>
  ) => Promise<void>;
  getPlayer: () => Promise<void>;
  setPlayer: (player: Player) => Promise<void>;
  removePlayer: () => Promise<void>;
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
}));
