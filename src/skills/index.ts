class Skill {
  name;
  type;
  damage;
  cost;

  constructor(
    name: string,
    type: 'physical' | 'magic',
    damage: number,
    cost: number
  ) {
    this.name = name;
    this.type = type;
    this.damage = damage;
    this.cost = cost;
  }
}

export default Skill;
