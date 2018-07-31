import React, { Component } from 'react';
import Statistics from '../Statistics/Statistics';
import { api } from '../../api/api';
import { getClass, getRace } from '../../translationFunctions';
import { wowSvg } from '../../svgs/WowIcon';
import { RealmOptions } from '../Misc/RealmOptions';
import './FullView.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'


class FullView extends Component {

    constructor() {
        super();

        this.state = {
            loading: false,
            verified: {
                characterOne: null,
                characterTwo: null
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

    back(e) {
        e.preventDefault();

        document.querySelector('.statistics__area').classList.remove('statistics__area--min');
        document.querySelector('.btn-back').classList.add('btn-back-hidden');
        document.querySelector('.btn-duel').classList.remove('btn-duel-hidden');
        this.setState({
            loading: false,
            verified: this.state.verified,
            duelActive: false,
            data: null,
            players: [{}, {}]
        });
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

                this.setState({...this.state, loading: true, verified: {characterOne: null, characterTwo: null}});
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
        if(e.target.value) {
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
                    })
                    .catch(err => {
                        this.setState({...this.state, verified: {characterOne: false, characterTwo: this.state.verified.characterTwo}});
                    })
                }, 500);
            } else {
                this.y && clearTimeout(this.y);
                this.y = setTimeout(() => {
                    this.api.confirmCharacter(character.name, character.realm, character.region)
                    .then(res => {
                        this.setState({...this.state, verified: {characterOne: this.state.verified.characterOne, characterTwo: true}});
                    })
                    .catch(err => {
                        this.setState({...this.state, verified: {characterOne: this.state.verified.characterOne, characterTwo: false}});
                    })
                }, 500);
            }
        } else {
            if(e.target.name === 'character_one_name') {
                this.setState({...this.state, verified: {characterOne: null, characterTwo: this.state.verified.characterTwo}});
            } else {
                this.setState({...this.state, verified: {characterOne: this.state.verified.characterOne, characterTwo: null}});
            }
        }
    }

    render() {
        return (
            <div style={{height: '100%'}}>
            <div className="wow-svg">
                { wowSvg }
            </div>
            {this.state.duelActive && (
                <div className="char-overlay">
                    <div className="char-overlay__bg" style={{backgroundImage: `url('${this.state.players[0].backgroundUrl}')`}}></div>
                    <div className="char-overlay__bg" style={{backgroundImage: `url('${this.state.players[1].backgroundUrl}')`}}></div>
                </div>
            )}
                <header>
                    <div className="header-field">
                        <div className="search-area">
                            <input ref="character_one_name" name="character_one_name" type="text" onChange={this.handleChange.bind(this)} placeholder="Enter character name.."/>
                            
                                { this.state.verified.characterOne && (
                                    <span class="character_confirmation character_confirmation--positive" ref="character_one_confirmation">
                                        Character found <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                )}

                                { this.state.verified.characterOne === false && (
                                    <span class="character_confirmation character_confirmation--negative" ref="character_one_confirmation">
                                        No Character Found <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                )}

                    
                        </div>
                        <select ref="character_one_realm" className="header-field__dropdown">
                            <RealmOptions />
                        </select>
                        <select ref="character_one_region" className="header-field__dropdown">
                            <option value="eu">EU</option>
                        </select>
                    </div>
                    <div className="header-field">
                    <div className="search-area">
                            <input ref="character_two_name" name="character_two_name" type="text" onChange={this.handleChange.bind(this)} placeholder="Enter character name.."/>
                            
                                { this.state.verified.characterTwo && (
                                    <span class="character_confirmation character_confirmation--positive" ref="character_one_confirmation">
                                        Character found <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                )}

                                { this.state.verified.characterTwo === false && (
                                    <span class="character_confirmation character_confirmation--negative" ref="character_one_confirmation">
                                        No Character Found <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                )}

                    
                        </div>
                        <select ref="character_two_realm" className="header-field__dropdown">
                            <RealmOptions />
                        </select>
                        <select ref="character_two_region" className="header-field__dropdown">
                            <option value="eu">EU</option>
                        </select>
                    </div>
                    <button className="btn-back btn-back-hidden" onClick={this.back.bind(this)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
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