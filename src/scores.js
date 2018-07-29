
export const scores = {
    petMultiplier: 1,
    mountMultiplier: 5,
    mounts: {
        mount: 5,
        mountMilestone(hundreds) {
            let score;
            hundreds === 1 && ( score = 50 );
            hundreds === 2 && ( score = 100 );
            hundreds === 3 && ( score = 200 );
            hundreds === 4 && ( score = 350 );
            return score;
        }
    },
    titleMultiplier: 15,
    exaltedReputationMultiplier: 12,
    reveredReputationMultiplier: 5,
    ilvlMultiplier: 2,
    achievements(pts) {
        return pts / 20;
    },
    arena(rating) {
        rating < 1500 && ( rating /= 15 );
        rating >= 1500 && ( rating /= 13 );
        rating >= 1800 && ( rating /= 11 );
        rating >= 2000 && ( rating /= 8 );
        rating >= 2200 && ( rating /= 6 );
        rating >= 2400 && ( rating /= 4 );
        rating >= 2700 && ( rating /= 2 );
        return rating;
    },
    skirmish(rating) {
        return this.arena(rating) / 3;
    },
    honorableKills(hks) {
        return hks / 300;
    },
    raidScores: {
        mythic: {
            current: 30,
            currentCleared: 200,
            previousTier: 10
        },
        heroic: {
            current: 10,
            currentCleared: 100,
            previousTier: 5
        },
        normal: {
            current: 5,
            currentCleared: 50,
            previousTier: 2
        },
        lfr: {
            current: 2,
            currentCleared: 10,
            previousTier: 1
        },
        legacy: {
            boss: 1
        }
    },
    misc: {
        maxProfession: 10,
        noMissingGems: 20,
        petBattlesWon(amount) {
            return Math.round(amount / 5);
        },
        positiveDuelRatio: 20
    }
};