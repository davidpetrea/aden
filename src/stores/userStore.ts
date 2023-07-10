import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

enum UserStorageFields {
  'username' = 'username',
}

interface UserState {
  username: string | undefined;
  getUsername: () => void;
  setUsername: (username: string) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  username: undefined,
  getUsername: async () => {
    try {
      const username = await AsyncStorage.getItem(UserStorageFields.username);
      if (username) {
        set({ username });
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  },
  setUsername: async (username: string) => {
    try {
      if (!username) {
        throw new Error('Name is required.');
      }
      await AsyncStorage.setItem(UserStorageFields.username, username);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  },
}));
