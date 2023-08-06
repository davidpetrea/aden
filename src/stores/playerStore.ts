import AsyncStorage from '@react-native-async-storage/async-storage';

import { create } from 'zustand';
import { Entity } from './gameManagerStore';
import {
  AutoAttack,
  Fireball,
  Skill,
  SkillIcons,
  SkillId,
  HeavyStrike,
  Tackle,
} from '../skills/skills';

//TODO: Improve and move skill typing
const WARRIOR_BASE_HEALTH = 44;
const MAGE_BASE_HEALTH = 32;
export const PLAYER_ID = 'player_id';

//TODO: Find better way to config class defaults to make it more readable/scalable
export type CharacterClass = 'warrior' | 'mage';

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
    unlocked: [AutoAttack, Tackle, HeavyStrike],
    equipped: [AutoAttack, Tackle, HeavyStrike],
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
  selectSkill: (skillId: SkillId, callback: () => void) => void;
  castSelfSkill: (skill: Skill) => void;
  updateSkillOnCast: (skill: Skill) => void;
  decrementActiveCooldowns: () => void;
  resetSkillCooldowns: () => void;
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
  selectSkill: (skillId, resetSelectedEnemies) => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;

    //check if skill is already selected
    if (currentPlayer.skills.selected.id === skillId) return;

    const skill = currentPlayer.skills.equipped.find(
      (skill) => skill.id === skillId
    );

    if (!skill) return;

    resetSelectedEnemies();

    set({
      player: {
        ...currentPlayer,
        skills: {
          ...currentPlayer.skills,
          selected: skill,
        },
      },
    });
  },
  castSelfSkill: (skill) => {
    console.log('Casting self skill');
  },
  updateSkillOnCast: (skill) => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;

    const updatedSkill: Skill = {
      ...skill,
      activeCooldown: skill.baseCooldown ? skill.baseCooldown : 0,
    };

    set({
      player: {
        ...currentPlayer,
        skills: {
          ...currentPlayer.skills,
          equipped: currentPlayer.skills.equipped.map((equippedSkill) => {
            if (equippedSkill.id === skill.id) {
              return updatedSkill;
            }

            return equippedSkill;
          }),
          selected: skill.baseCooldown
            ? AutoAttack
            : currentPlayer.skills.selected,
        },
        currentAP: Math.max(currentPlayer.currentAP - skill.baseAPCost, 0),
      },
    });
  },

  resetSkillCooldowns: () => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;

    set({
      player: {
        ...currentPlayer,
        skills: {
          ...currentPlayer.skills,
          selected: {
            ...currentPlayer.skills.selected,
            activeCooldown: undefined,
          },
          equipped: currentPlayer.skills.equipped.map((skill) => ({
            ...skill,
            activeCooldown: undefined,
          })),
        },
      },
    });
  },
  decrementActiveCooldowns: () => {
    const currentPlayer = get().player;
    if (!currentPlayer) return;

    set({
      player: {
        ...currentPlayer,
        skills: {
          ...currentPlayer.skills,
          selected: {
            ...currentPlayer.skills.selected,
            activeCooldown: !!currentPlayer.skills.selected.activeCooldown
              ? currentPlayer.skills.selected.activeCooldown - 1
              : undefined,
          },
          equipped: currentPlayer.skills.equipped.map((skill) => ({
            ...skill,
            activeCooldown: !!skill.activeCooldown
              ? skill.activeCooldown - 1
              : undefined,
          })),
        },
      },
    });
  },
}));
