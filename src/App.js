import React, { Component } from 'react';
import { api } from './api/api.js';
import FullView from './components/FullView/FullView.jsx';

class App extends Component {

  constructor() {
    super();

    this.state = {
      name: null,
      level: null,
      thumbnail: null,
      achievementPoints: null,
      loading: false,
      ready: false,
      _404: false
    };
  }

  search(e) {
    e.preventDefault();

    const userInput = document.getElementById('user-input').value;
    const userInput2 = document.getElementById('user-input2').value;
    console.log(userInput);
    api.init();
    api.getCharacter(userInput, 'ravencrest', 'eu')
    .then(res => {
      if(res.status === 200) {

      }
    })
    .catch(err => this.setState({...this.state, _404: true}));
  }

  
  render() {
    return (
      <div style={{height: '100%'}}>
        <FullView />
      </div>
    );
  }
}

export default App;