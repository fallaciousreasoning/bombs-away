export default class Powerup {
    type: 'powerup' = 'powerup';
    power: 'laser' | 'grenade' | 'agility' | 'invulnerable';
    
    constructor(power: Powerup['power']) {
        this.power = power;
    }
}