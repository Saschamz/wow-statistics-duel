import { apikey } from './apikey.js';

const requestQuery = [`
    profile, achievements, appearance, feed, guild, hunterPets, items, mounts, professions, progression, pvp, quests, reputation, statistics, stats, talents, titles, audit
`];
const requestQuery_min = ['profile'];

export const api = {
    init() {
        this.blizzard = require('../blizzard.js/index.js').initialize({ apikey });
    },
    
    getCharacter(name, realm, origin) {
        if(!name || !realm || !origin) {
            return null;
        } else {
            return this.blizzard.wow.character(requestQuery, {
                origin,
                realm,
                name,
            });
        }
    },

    confirmCharacter(name, realm, origin) {
        if(!name || !realm || !origin) {
            return null;
        } else {
            return this.blizzard.wow.character(requestQuery_min, {
                origin,
                realm,
                name,
            });
        }
    }
}