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
            <div>
              <h1 className="App-title"><strong>Lapak</strong>Waifu <strong>:)</strong></h1>
            </div>
            <nav>
              <ul>
                <a href="#"><li>Top Waifus</li></a>
                <a href="#"><li>New Waifus</li></a>
                <a href="#"><li>Loley</li></a>
              </ul>
            </nav>
          </header>
          <p className="App-intro">
            Bid Your Waifu!
          </p>
          <div className="card-wrapper">
            {this.state.characters.map(character => {
              return (
                <div
                  key={character.id}
                  className="card">
                  <img src={character.avatarUrl} />
                  <h3>{character.name}</h3>
                  <div className="value">{web3.utils.fromWei(character.value, 'ether')} ETH</div>
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
