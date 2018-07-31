import React, { Component } from 'react';
import { scores } from '../../scores.js';
import './Statistics.css';

class Statistics extends Component {

    constructor(props) {
        super(props);

        this.state = {
            calculated: false,
            rendered: false
        };
    }

    componentDidMount() {

        const playerScores = [{}, {}];

        console.log(this.props.data);

        this.props.data.forEach((data, index) => {
            
            // Object Setup
            playerScores[index].achievements = {score: 0, title: 'Achievements'};
            playerScores[index].mounts = {score: 0, title: 'Mounts'};
            playerScores[index].titles = {score: 0, title: 'Titles'};
            playerScores[index].ilvl = {score: 0, title: 'Item Level'};
            playerScores[index].reputation = {score: 0, title: 'Reputations'};
            playerScores[index].raiding = {score: 0, title: 'Raiding'};
            playerScores[index].pvp = {score: 0, title: 'PvP'};
            playerScores[index].misc = {score: 0, title: 'Misc'};
            playerScores[index].totalScore = {score: 0, title: 'Total Score'};
            
            // Achievements
            playerScores[index].achievements.score = scores.achievements(data.achievementPoints);
            
            // Mounts
            playerScores[index].mounts.score = data.mounts.numCollected * scores.mounts.mount;
            let hundreds = Math.floor(data.mounts.numCollected / 100);
            hundreds > 0 && ( playerScores[index].mounts.score += scores.mounts.mountMilestone(hundreds) );
            
            // Titles
            playerScores[index].titles.score = data.titles.length * scores.titleMultiplier;
            
            // Item Level
            playerScores[index].ilvl.score = data.items.averageItemLevel * scores.ilvlMultiplier;
            // If character has not logged in since BFA iLvL squish 18th July 2018
            if(this.props.data[index].lastModified < 1531872000000 ) playerScores[index].ilvl.score /= 5;

            // Misc
            let maxProfessions, noMissingGems, petBattlesWon, positiveDuelRatio;
            maxProfessions = noMissingGems = petBattlesWon = positiveDuelRatio = 0;
            data.professions.primary.forEach(profession => {
                if(profession.rank === profession.max) maxProfessions += scores.misc.maxProfession;
            });
            data.professions.secondary.forEach(profession => {
                if(profession.rank === profession.max) maxProfessions += scores.misc.maxProfession;
            });
            petBattlesWon = scores.misc.petBattlesWon(data.statistics.subCategories[10].statistics[1].quantity);
            const duelData = data.statistics.subCategories[9].subCategories[2].statistics;
            if(duelData[0].quantity > duelData[1].quantity) positiveDuelRatio = scores.misc.positiveDuelRatio;
            if(data.audit.emptySockets < 1) noMissingGems = scores.misc.noMissingGems;

            const miscTotalScore = maxProfessions + noMissingGems + petBattlesWon + positiveDuelRatio;

            playerScores[index].misc.score = miscTotalScore;
            
            // Reputation
            let rep = 0;
            data.reputation.forEach(faction => {
                if(faction.standing === 7) rep += scores.exaltedReputationMultiplier;
                else if(faction.standing === 6) rep += scores.reveredReputationMultiplier;
            });
            playerScores[index].reputation.score = rep;
           
            // PvP
            playerScores[index].pvp.score += scores.honorableKills(data.totalHonorableKills);
            for(let bracket in data.pvp.brackets) {
                if(data.pvp.brackets[bracket].slug !== '2v2s') playerScores[index].pvp.score += scores.arena(data.pvp.brackets[bracket].rating);
                else playerScores[index].pvp.score += scores.skirmish(data.pvp.brackets[bracket].rating);
            }
            
            // Raiding
            data.progression.raids.forEach((raid, i) => {
                // Current Raid Tier 0
                if(i + 1 === data.progression.raids.length) {
                    raid.lfr > 0 && ( playerScores[index].raiding.score += scores.raidScores.lfr.currentCleared );
                    raid.normal > 0 && ( playerScores[index].raiding.score += scores.raidScores.normal.currentCleared );
                    raid.heroic > 0 && ( playerScores[index].raiding.score += scores.raidScores.heroic.currentCleared );
                    raid.mythic > 0 && ( playerScores[index].raiding.score += scores.raidScores.mythic.currentCleared );
                    raid.bosses.forEach(boss => {
                        boss.lfrKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.lfr.current );
                        boss.normalKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.normal.current );
                        boss.heroicKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.heroic.current );
                        boss.mythicKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.mythic.current );
                    });
                // Previous Raid Tier 1-6
                } else if(i + 1 >= data.progression.raids.length - 6) {
                    raid.bosses.forEach(boss => {
                        boss.lfrKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.lfr.previousTier );
                        boss.normalKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.normal.previousTier );
                        boss.heroicKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.heroic.previousTier );
                        boss.mythicKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.mythic.previousTier );
                    });
                // Legacy Raid Tier 6+
                } else {
                    raid.bosses.forEach(boss => {
                        boss.lfrKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.legacy.boss );
                        boss.normalKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.legacy.boss );
                        boss.heroicKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.legacy.boss );
                        boss.mythicKills > 0 && ( playerScores[index].raiding.score += scores.raidScores.legacy.boss );
                    });
                }
            });
            
        });

        playerScores.forEach(player => {
            for(let prop in player) {
                player[prop].score = Math.round(player[prop].score);
                player.totalScore.score += player[prop].score;
            }
        });

        this.playerScores = playerScores;

        this.setState({calculated: true, rendered: this.state.rendered});

        console.log('Calculated scores: ', playerScores);
    }

    renderStatistics() {
        let jsx = [];

        // Mounts sometimes return 0 (bug), if this happens ignore mounts
        console.log('playerscores', this.playerScores)
        if(!this.state.rendered && ( !this.playerScores[0].mounts.score || !this.playerScores[1].mounts.score )) {
            this.playerScores.forEach(player => {
                player.mounts && delete player.mounts;
            });
        }

        for(let prop in this.playerScores[0]) {
            const winnerClass = 'statistic__stat statistic__stat--winner';
            const loserClass = 'statistic__stat statistic__stat--loser';
            let winner;
            
            this.playerScores[0][prop].score > this.playerScores[1][prop].score ? ( winner = 0 ) : ( winner = 1 ); 
            jsx.push((
                <div className="statistic">
                    <div className={winner < 1 ? winnerClass : loserClass}>
                        { this.playerScores[0][prop].title !== 'Total Score' && '+' }
                        { this.playerScores[0][prop].score }
                        <span>pts.</span>
                    </div>
                    <div className='statistic__arrow'>
                        { this.playerScores[0][prop].title }
                    </div>
                    <div className={winner > 0 ? winnerClass : loserClass}>
                        { this.playerScores[0][prop].title !== 'Total Score' && '+' }
                        { this.playerScores[1][prop].score }
                        <span>pts.</span>
                    </div>
                </div>
            ));
        }

        // Dynamic delay
        let delay = 1500;
        let totalDelay = 0;
        for(let prop in this.playerScores[0]) {
            totalDelay += delay;
        }
        // Delay loop is working, but the animation is too early when mounts are missing (BUG)
        console.log('Delay is: ', totalDelay);

        // Sets the winner BG as fullscreen
        const winningPlayerIndex = this.playerScores[0].totalScore.score > this.playerScores[1].totalScore.score ? 0 : 1;
        const losingPlayerIndex = winningPlayerIndex === 1 ? 0 : 1;
        if(!this.state.rendered) {
            this.setState({calculated: true, rendered: true});
            setTimeout(() => {
                // Animate Names
                if(document.querySelector('.player')) {
                    document.querySelectorAll('.player')[winningPlayerIndex].classList.add('player--victor');
                    document.querySelectorAll('.player')[losingPlayerIndex].classList.add('player--loser');

                    // Animate Overlay
                    document.querySelectorAll('.char-overlay__bg')[winningPlayerIndex].classList.add('char-overlay__bg--fullscreen');

                    setTimeout(() => {
                        document.querySelector('.statistics__area').classList.add('statistics__area--min');

                        setTimeout(() => {
                            let playerOneTitleSmall = document.createElement('span');
                            playerOneTitleSmall.innerText = this.props.data[0].name;
                            playerOneTitleSmall.className = `statistic-name ${winningPlayerIndex < 1 ? 'statistic-name--winner' : 'statistic-name--loser'}`;

                            let playerTwoTitleSmall = document.createElement('span');
                            playerTwoTitleSmall.innerText = this.props.data[1].name;
                            playerTwoTitleSmall.className = `statistic-name ${winningPlayerIndex > 0 ? 'statistic-name--winner' : 'statistic-name--loser'}`;

                            document.querySelectorAll('.statistic__stat')[0].appendChild(playerOneTitleSmall);
                            document.querySelectorAll('.statistic__stat')[1].appendChild(playerTwoTitleSmall);
                            document.querySelector('.btn-back').classList.remove('btn-back-hidden'); // Testing
                        }, 500);

                    }, 500);

                }

            }, totalDelay);
        }

        return jsx;
    }

    render() {
        return (
            <div>
                {this.state.calculated && this.renderStatistics()}
            </div>
        );
    }
}

export default Statistics;