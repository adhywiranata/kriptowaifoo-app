import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Web3Provider } from 'react-web3';
import web3 from './web3';
import characterFactory from './characterFactory';

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
      <Web3Provider>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">KriptoWaifoo</h1>
          </header>
          <p className="App-intro">
            Bid Your Waifu!
          </p>
          <div>
            {this.state.characters.map(character => {
              return (
                <div key={character.id} style={{ display: 'inline-block', width: '25%', padding: 15, margin: 15, border: '1px solid rgba(0,0,0,0.1)' }}>
                  <h3>{character.name}</h3>
                  PRICE: {web3.utils.fromWei(character.value, 'ether')} ETH<br />
                  <img src={character.avatarUrl} height="300" />
                </div>
              );
            })}
          </div>
        </div>
      </Web3Provider>
    );
  }
}

export default App;
