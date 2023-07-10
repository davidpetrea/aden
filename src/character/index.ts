export type CharacterClass = 'warrior' | 'mage';

class Character {
  name;
  specialization;
  level;

  constructor(name: string, specialization: CharacterClass) {
    this.name = name;
    this.specialization = specialization;
    this.level = 1;
  }
}

export default Character;
