import React, { Component } from 'react';
import Statistics from '../Statistics/Statistics.jsx';
import { api } from '../../api/api.js';
import { getClass, getRace } from '../../translationFunctions';
import './FullView.css';

class FullView extends Component {

    constructor() {
        super();

        this.state = {
            loading: false,
            verified: {
                characterOne: false,
                characterTwo: false
            },
            duelActive: false,
            data: null,
            players: [{}, {}]
        };
    }

    componentDidMount() {
        this.api = api;
        this.api.init();
    }

    componentDidUpdate() {
        const btn = document.querySelector('.btn-duel');
        if(this.state.verified.characterOne && this.state.verified.characterTwo) {
            btn.classList.add('btn-duel--ready');
        } else {
            btn.classList.remove('btn-duel--ready');
        }
    }

    // Begins the duel, makes API calls. Passes information to Statistics component if everything works out fine.
    duel() {

        if(!!document.querySelector('.btn-duel--ready')) {
            
            // Create character array with objects
            const characterOne = {
                name: this.refs.character_one_name.value,
                realm: this.refs.character_one_realm.value,
                region: this.refs.character_one_region.value
            };

            const characterTwo = {
                name: this.refs.character_two_name.value,
                realm: this.refs.character_two_realm.value,
                region: this.refs.character_two_region.value
            };

            const characters = [characterOne, characterTwo];

            // Basic validation
            if( characterOne.name === characterTwo.name &&
                characterOne.realm === characterTwo.realm &&
                characterOne.region === characterTwo.region ) {
                    alert('Error: Same Characters.');
            } else {

                document.querySelector('footer button').classList.add('btn-duel-hidden');

                this.refs.character_one_name.value = '';
                this.refs.character_two_name.value = '';

                this.setState({...this.state, loading: true});
                let error = false;
                let data = [];
                let completed = 0;
        
                // API calls
                characters.forEach(character => {
                    this.api.getCharacter(character.name, character.realm, character.region)
                    .then(res => {
                        if(res.status === 200) {
                            data.push(res.data);
                            ++completed;
                            if(completed == 2) {
                                // THIS IS THE PROFILE IMAGES YAAY
                                data[0].thumbnail = data[0].thumbnail.replace('avatar', 'main');
                                data[1].thumbnail = data[1].thumbnail.replace('avatar', 'main');
                                const img_1 = `https://render-eu.worldofwarcraft.com/character/${data[0].thumbnail}`;
                                const img_2 = `https://render-eu.worldofwarcraft.com/character/${data[1].thumbnail}`;
                                console.log(img_1, img_2);
                                // THIS IS THE PROFILE IMAGES YAAY
                                this.setState({
                                    ...this.state,
                                    _404: false,
                                    loading: false,
                                    duelActive: true,
                                    players: [
                                        {
                                            name: data[0].name,
                                            className: getClass(data[0].class).className,
                                            classColor: getClass(data[0].class).classColor,
                                            level: data[0].level,
                                            race: getRace(data[0].race),
                                            backgroundUrl: img_1
                                        },
                                        {
                                            name: data[1].name,
                                            className: getClass(data[1].class).className,
                                            classColor: getClass(data[1].class).classColor,
                                            level: data[1].level,
                                            race: getRace(data[1].race),
                                            backgroundUrl: img_2
                                        }
                                    ],
                                    data
                                });
                            }
                        }
                    })
                    .catch(err => {
                        error = true;
                        console.log(err);
                    });
                });
        
                if(error) {
                    console.log('Could not find one of the characters');
                }
            }
        }
    }

    renderPlayerOne() {
        return (
            <div className="player" id="player_one"> 
                <h1 className="player__name" style={{color: this.state.players[0].classColor}}>{this.state.players[0].name}</h1>
                <span className="player__info">Level {this.state.players[0].level} {this.state.players[0].race} {this.state.players[0].className}</span>
            </div>
        );
    }

    renderPlayerTwo() {
        return (
            <div className="player" id="player_two"> 
                <h1 className="player__name" style={{color: this.state.players[1].classColor}}>{this.state.players[1].name}</h1>
                <span className="player__info">Level {this.state.players[1].level} {this.state.players[1].race} {this.state.players[1].className}</span>
            </div>
        );
    }

    // Checks if the characters exist
    handleChange(e) {
        let character;
        e.target.style.color = 'white';
        if(e.target.name === 'character_one_name') {
            character = {
                name: this.refs.character_one_name.value,
                realm: this.refs.character_one_realm.value,
                region: this.refs.character_one_region.value
            };
        } else {
            character = {
                name: this.refs.character_two_name.value,
                realm: this.refs.character_two_realm.value,
                region: this.refs.character_two_region.value
            };
        }
        if(e.target.name === 'character_one_name') {
            this.x && clearTimeout(this.x);
            this.x = setTimeout(() => {
                this.api.confirmCharacter(character.name, character.realm, character.region)
                .then(res => {
                    this.setState({...this.state, verified: {characterOne: true, characterTwo: this.state.verified.characterTwo}});
                    this.refs.character_one_name.style.color = 'green'
                })
                .catch(err => this.refs.character_one_name.style.color = 'red')
            }, 500);
        } else {
            this.y && clearTimeout(this.y);
            this.y = setTimeout(() => {
                this.api.confirmCharacter(character.name, character.realm, character.region)
                .then(res => {
                    this.setState({...this.state, verified: {characterOne: this.state.verified.characterOne, characterTwo: true}});
                    this.refs.character_two_name.style.color = 'green'
                })
                .catch(err => this.refs.character_two_name.style.color = 'red')
            }, 500);
        }
    }

    render() {
        return (
            <div style={{height: '100%'}}>
            {this.state.duelActive && (
                <div className="char-overlay">
                    <div className="char-overlay__bg" style={{backgroundImage: `url('${this.state.players[0].backgroundUrl}')`}}></div>
                    <div className="char-overlay__bg" style={{backgroundImage: `url('${this.state.players[1].backgroundUrl}')`}}></div>
                </div>
            )}
                <header>
                    <div className="header-field">
                        <input ref="character_one_name" name="character_one_name" type="text" onChange={this.handleChange.bind(this)} placeholder="Enter character name.."/>
                        <select ref="character_one_realm" className="header-field__dropdown">
                            <option value="ravencrest">Ravencrest</option>
                            <option value="ragnaros">Ragnaros</option>
                        </select>
                        <select ref="character_one_region" className="header-field__dropdown">
                            <option value="eu">EU</option>
                        </select>
                    </div>
                    <div className="header-field">
                        <input ref="character_two_name" name="character_two_name" id="character_two_name"  onChange={this.handleChange.bind(this)} type="text" placeholder="Enter character name.."/>
                        <select ref="character_two_realm" className="header-field__dropdown">
                            <option value="ravencrest">Ravencrest</option>
                            <option value="ragnaros">Ragnaros</option>
                        </select>
                        <select ref="character_two_region" className="header-field__dropdown">
                            <option value="eu">EU</option>
                        </select>
                    </div>
                </header>

                <div className="statistics__area">
                    { this.state.duelActive && <Statistics data={this.state.data}/>}
                </div>

                <footer>
                    {this.state.duelActive && this.renderPlayerOne()}
                    <button className="btn-duel" onClick={this.duel.bind(this)}>Duel</button>
                    {this.state.duelActive && this.renderPlayerTwo()}
                </footer>
            </div>
        );
    }
}

export default FullView;