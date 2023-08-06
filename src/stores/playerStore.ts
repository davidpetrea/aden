import AsyncStorage from '@react-native-async-storage/async-storage';

import { create } from 'zustand';
import { Entity } from './gameManagerStore';

import AutoAttackIcon from '../../assets/svg/autoattack.svg';
import { SvgProps } from 'react-native-svg/lib/typescript/ReactNativeSVG';
import React from 'react';
//TODO: Improve and move skill typing
const WARRIOR_BASE_HEALTH = 44;
const MAGE_BASE_HEALTH = 32;

enum SkillIDs {
  'BASIC_ATTACK' = 'BASIC_ATTACK',
  'TACKLE' = 'TACKLE',
  'FIREBALL' = 'FIREBALL',
}

export type SkillId = keyof typeof SkillIDs;

export const SkillIcons: Record<SkillId, React.FC<SvgProps>> = {
  BASIC_ATTACK: AutoAttackIcon,
  TACKLE: AutoAttackIcon,
  FIREBALL: AutoAttackIcon,
};

//TODO: Find better way to config class defaults to make it more readable/scalable
export type CharacterClass = 'warrior' | 'mage';

export type Skill = {
  id: SkillId;
  name: string;
  level: number;
  targetType: 'self' | 'enemy';
  targetCountType: 'single' | 'multiple';
  maxTargetCount?: number;
  baseAPCost: number;
  baseDamage: number;
  cooldown?: number;
  icon: React.FC<SvgProps>;
  specialization: CharacterClass | CharacterClass[]; //TODO: proper typing of array of specs, union => set
};

const AutoAttack: Skill = {
  baseDamage: 5,
  id: SkillIDs.BASIC_ATTACK,
  level: 1,
  name: 'Basic attack',
  targetCountType: 'single',
  targetType: 'enemy',
  icon: AutoAttackIcon,
  specialization: ['mage', 'warrior'],
  baseAPCost: 1,
};

const Tackle: Skill = {
  baseDamage: 10,
  id: SkillIDs.TACKLE,
  level: 1,
  name: 'Tackle',
  targetCountType: 'single',
  targetType: 'enemy',
  icon: AutoAttackIcon,
  specialization: 'warrior',
  cooldown: 1,
  baseAPCost: 2,
};

const Fireball: Skill = {
  baseDamage: 15,
  id: SkillIDs.FIREBALL,
  level: 1,
  name: 'Fireball',
  targetCountType: 'single',
  targetType: 'enemy',
  icon: AutoAttackIcon,
  specialization: 'mage',
  cooldown: 2,
  baseAPCost: 2,
};

enum PlayerStorageFields {
  'player' = 'player',
}

type ClassSpecificFields = Pick<
  Player,
  'maxHealth' | 'currentHealth' | 'initiative' | 'specialization' | 'skills'
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

const warriorDefaults: ClassSpecificFields = {
  currentHealth: WARRIOR_BASE_HEALTH,
  maxHealth: WARRIOR_BASE_HEALTH,
  initiative: 10,
  specialization: 'warrior',
  skills: {
    unlocked: [AutoAttack, Tackle],
    equipped: [AutoAttack, Tackle],
    selected: AutoAttack,
  },
};
const mageDefaults: ClassSpecificFields = {
  currentHealth: MAGE_BASE_HEALTH,
  maxHealth: MAGE_BASE_HEALTH,
  initiative: 8,
  specialization: 'mage',
  skills: {
    unlocked: [AutoAttack, Fireball],
    equipped: [AutoAttack, Fireball],
    selected: AutoAttack,
  },
};

export type Player = Entity & {
  name: string;
  specialization: CharacterClass;
  level: number;
  currentExp: number;
  currentExpRequired: number;
  currentAP: number;
  maxAP: number;
  skills: {
    unlocked: Skill[];
    equipped: Skill[];
    selected: Skill;
  };
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
      const player: Player = playerJson ? JSON.parse(playerJson) : null;

      if (player) {
        //Init skill icons when getting player
        player.skills.equipped = player.skills.equipped.map((skill) => ({
          ...skill,
          icon: SkillIcons[skill.id],
        }));
        player.skills.unlocked = player.skills.unlocked.map((skill) => ({
          ...skill,
          icon: SkillIcons[skill.id],
        }));
        player.skills.selected = {
          ...player.skills.selected,
          icon: SkillIcons[player.skills.selected.id],
        };

        console.log('player skills before set?', player.skills.equipped);

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
