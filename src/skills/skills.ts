import { SvgProps } from 'react-native-svg/lib/typescript/ReactNativeSVG';

import AutoAttackIcon from '../../assets/svg/autoattack.svg';
import { CharacterClass } from 'src/stores/playerStore';

import React from 'react';

enum SkillIDs {
  'BASIC_ATTACK' = 'BASIC_ATTACK',
  'TACKLE' = 'TACKLE',
  'HEAVY_STRIKE' = 'HEAVY_STRIKE',
  'FIREBALL' = 'FIREBALL',
}
export type SkillId = keyof typeof SkillIDs;

export const SkillIcons: Record<SkillId, React.FC<SvgProps>> = {
  BASIC_ATTACK: AutoAttackIcon,
  TACKLE: AutoAttackIcon,
  HEAVY_STRIKE: AutoAttackIcon,
  FIREBALL: AutoAttackIcon,
};

export type Skill = {
  id: SkillId;
  name: string;
  description: string;
  level: number;
  targetType: 'self' | 'enemy';
  targetCountType: 'single' | 'multiple';
  maxTargetCount?: number;
  baseAPCost: number;
  baseDamage: number;
  baseCooldown?: number;
  activeCooldown?: number;
  icon: React.FC<SvgProps>;
  specialization: CharacterClass | CharacterClass[]; //TODO: proper typing of array of specs, union => set
};

export const AutoAttack: Skill = {
  baseDamage: 5,
  id: SkillIDs.BASIC_ATTACK,
  level: 1,
  name: 'Basic attack',
  description:
    'This skill can target one enemy at a time, damage scales with equipped weapon.',
  targetCountType: 'single',
  targetType: 'enemy',
  icon: AutoAttackIcon,
  specialization: ['mage', 'warrior'],
  baseAPCost: 1,
};

export const Tackle: Skill = {
  baseDamage: 10,
  id: SkillIDs.TACKLE,
  level: 1,
  name: 'Tackle',
  description: 'Tackle your foe, dealing some moderate damage',
  targetType: 'enemy',
  targetCountType: 'single',
  icon: AutoAttackIcon,
  specialization: 'warrior',
  baseCooldown: 2,
  baseAPCost: 2,
};

export const HeavyStrike: Skill = {
  baseDamage: 6,
  id: SkillIDs.HEAVY_STRIKE,
  level: 1,
  name: 'Heavy Strike',
  description:
    'Strike multiple enemies with all your might, dealing damage with a small chance to stun.',
  targetCountType: 'multiple',
  targetType: 'enemy',
  icon: AutoAttackIcon,
  specialization: 'warrior',
  baseCooldown: 4,
  baseAPCost: 3,
  maxTargetCount: 4,
};

export const Fireball: Skill = {
  baseDamage: 15,
  id: SkillIDs.FIREBALL,
  level: 1,
  name: 'Fireball',
  description:
    'Shoots a fire ball at the targeted enemy, with a small chance of setting the target ablaze.',
  targetCountType: 'single',
  targetType: 'enemy',
  icon: AutoAttackIcon,
  specialization: 'mage',
  baseCooldown: 2,
  baseAPCost: 2,
};
