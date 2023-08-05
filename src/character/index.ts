import Skill from 'src/skills';
import { HeavyStrike, Tackle } from '../skills/warriorSkills';
import { Fireball, IceNeedle } from '../skills/mageSkills';

export type CharacterClass = 'warrior' | 'mage';

class Character {
  name;
  specialization;
  level;
  experience;
  skills: Skill[] = [];

  constructor(
    name: string,
    specialization: CharacterClass,
    level: number = 1,
    experience: number = 0
  ) {
    this.name = name;
    this.specialization = specialization;
    this.level = level;
    this.experience = experience;
    if (specialization === 'warrior') {
      this.skills = [Tackle];
    } else if (specialization === 'mage') {
      this.skills = [Fireball];
    }
  }
}

export default Character;
