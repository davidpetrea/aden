import Skill from 'src/skills';
import { HeavyStrike, Tackle } from '../skills/warriorSkills';
import { Fireball, IceNeedle } from '../skills/mageSkills';

export type CharacterClass = 'warrior' | 'mage';

class Character {
  name;
  specialization;
  level = 1;
  experience = 0;
  skills: Skill[] = [];

  constructor(name: string, specialization: CharacterClass) {
    this.name = name;
    this.specialization = specialization;
    if (specialization === 'warrior') {
      this.skills = [Tackle];
    } else if (specialization === 'mage') {
      this.skills = [Fireball];
    }
  }
}

export default Character;
