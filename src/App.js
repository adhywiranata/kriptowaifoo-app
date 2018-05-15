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
    showBuyModal: false,
    selectedCharacter: {
      id: null,
      name: null,
      value: 0,
      actualValue: 0,
    },
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
      value: Number(web3.utils.fromWei(value, 'ether')),
    }));

    this.setState({ creator, characters, balance });
  }

  toggleModal = () => {
    this.setState({ showBuyModal: !this.state.showBuyModal });
  }

  pickCharacter = (character) => {
    this.setState({
      selectedCharacter: {...character, actualValue: character.value },
    }, this.toggleModal);
  }

  setSelectedCharacterValue = (e) => {
    if(!isNaN(Number(e.target.value))) {
      this.setState({
        selectedCharacter: {
          ...this.state.selectedCharacter,
          value: e.target.value,
        },
      });
    }
  }

  buySelectedCharacterValue = (e) => {
    e.preventDefault();
    const value = this.state.selectedCharacter.value;
    const currentValue = this.state.selectedCharacter.actualValue + 0.001;
    if(value < currentValue) {
      alert('CANNOT BE LOWER!');
    } else {
      alert('THIS IS YOURS!');
    }
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
            {this.state.characters.map(character => <Card character={character} pickCharacter={() => this.pickCharacter(character)} toggleModal={this.toggleModal} />)}
          </div>
          {this.state.showBuyModal && (
            <div>
              <div onClick={this.toggleModal} className="App-overlay"></div>
              <div className="App-modal">
                <h4>Buy {this.state.selectedCharacter.name}?</h4>
                <p>You can buy this character starting from the current value + 0.001 ETH</p>
                <form onSubmit={this.buySelectedCharacterValue}>
                  <div>
                    <input type="text" onChange={this.setSelectedCharacterValue} value={this.state.selectedCharacter.value} /> ETH
                  </div>
                  <button>BUY</button>
                </form>
                <img src="https://lh6.googleusercontent.com/0g9_JEL0ItT1qUU9NI-gZhVaT913XY2JrvtMmTBRx9auBjU98nK6PJQF12K_RMu3DIK3Gef61AecLpDAJ1I=w1441-h804-rw" style={{ height: '45%', position: 'absolute', bottom: 0, right: 0}} />
              </div>
            </div>
          )}
        </Web3Provider>
      </div>
    );
  }
}

export default App;
