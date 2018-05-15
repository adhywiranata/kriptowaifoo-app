import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Web3Provider } from 'react-web3';
import web3 from './web3';
import characterFactory from './characterFactory';

import Header from './components/Header';
import Card from './components/Card';

class App extends Component {
  state = {
    creator: null,
    characters: [],
    balance: '',
    value: '',
    isLoading: false,
  }

  async componentDidMount() {
    // const creator = await characterFactory.methods.creator().call();
    const creator = '';
    const charactersIds = await characterFactory.methods.getCharactersIds().call();
    const balance = await web3.eth.getBalance(characterFactory.options.address);

    const charactersPromise = charactersIds.map(id => characterFactory.methods.getCharacter(id).call());
    let characters = await Promise.all(charactersPromise);
    characters = characters.map(({ id, name, anime, avatarUrl, value }) => ({
      id,
      name,
      anime,
      avatarUrl,
      value,
    }));

    this.setState({ creator, characters, balance });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Web3Provider>
          <p className="App-intro">
            Bid Your Waifu!
          </p>
          <div className="card-wrapper">
            {this.state.characters.map(character => <Card character={character} />)}
          </div>
        </Web3Provider>
      </div>
    );
  }
}

export default App;
