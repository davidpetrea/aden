import AsyncStorage from '@react-native-async-storage/async-storage';
import Character, { CharacterClass } from '../character';
import { create } from 'zustand';

enum UserStorageFields {
  'character' = 'character',
}

export type CharacterProperties = {
  name: string;
  specialization: CharacterClass;
  level: number;
};

interface UserState {
  character: Character | undefined;
  createCharacter: (
    data: Pick<Character, 'name' | 'specialization'>
  ) => Promise<void>;
  getCharacter: () => Promise<void>;
  setCharacter: (character: Character) => Promise<void>;
  removeCharacter: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set) => ({
  character: undefined,
  getCharacter: async () => {
    try {
      const characterJson = await AsyncStorage.getItem(
        UserStorageFields.character
      );
      const character = characterJson ? JSON.parse(characterJson) : null;
      if (character) {
        set({ character });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  },
  createCharacter: async (data) => {
    if (!data) {
      throw new Error('Character could not be created due to invalid data.');
    }

    const newCharacter = new Character(data.name, data.specialization);

    await AsyncStorage.setItem(
      UserStorageFields.character,
      JSON.stringify({
        newCharacter,
      })
    );

    set({ character: newCharacter });
  },
  setCharacter: async (character) => {
    try {
      if (!character) {
        throw new Error('Character undefined or null.');
      }
      await AsyncStorage.setItem(
        UserStorageFields.character,
        JSON.stringify(character)
      );

      set({ character });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  },
  removeCharacter: async () => {
    try {
      await AsyncStorage.removeItem(UserStorageFields.character);
      set({ character: undefined });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  },
}));
