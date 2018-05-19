import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Web3Provider } from "react-web3";
import web3 from "./web3";
import characterFactory from "./characterFactory";

import Header from "./components/Header";
import Card from "./components/Card";

class App extends Component {
  state = {
    loggedUserAccount: null,
    creator: null,
    characters: [],
    balance: "",
    value: "",
    isLoading: false,
    showBuyModal: false,
    selectedCharacter: {
      id: null,
      name: null,
      value: 0,
      actualValue: 0
    }
  };

  async componentDidMount() {
    // const creator = await characterFactory.methods.creator().call();
    // get current logged user account
    const loggedUserAccount = await web3.eth.getAccounts();
    this.setState({
      loggedUserAccount: loggedUserAccount[0],
    });

    const creator = "";
    const charactersIds = await characterFactory.methods
      .getCharactersIds()
      .call();
    const balance = await web3.eth.getBalance(characterFactory.options.address);

    const charactersPromise = charactersIds.map(id =>
      characterFactory.methods.getCharacter(id).call()
    );
    const ownersPromise = charactersIds.map(id =>
      characterFactory.methods.characterOwnership(id).call()
    );
    let characters = await Promise.all(charactersPromise);
    let owners = await Promise.all(ownersPromise);
    characters = characters.map(
      ({ id, name, anime, avatarUrl, value }, key) => ({
        id,
        name,
        anime,
        avatarUrl,
        value: Number(web3.utils.fromWei(value, "ether")),
        owner: owners[key]
      })
    );

    this.setState({ creator, characters, balance });
  }

  toggleModal = () => {
    this.setState({ showBuyModal: !this.state.showBuyModal });
  };

  pickCharacter = character => {
    this.setState(
      {
        selectedCharacter: { ...character, actualValue: character.value }
      },
      this.toggleModal
    );
  };

  setSelectedCharacterValue = e => {
    if (!isNaN(Number(e.target.value))) {
      this.setState({
        selectedCharacter: {
          ...this.state.selectedCharacter,
          value: e.target.value
        }
      });
    }
  };

  buySelectedCharacterValue = async event => {
    event.preventDefault();
    const value = this.state.selectedCharacter.value;
    const actualValue = this.state.selectedCharacter.actualValue + 0.001;
    const accounts = await web3.eth.getAccounts();
    if (value < actualValue) {
      alert("CANNOT BE LOWER!");
    } else {
      try {
        await characterFactory.methods
        .buyCharacter(this.state.selectedCharacter.id)
        .send({ value: web3.utils.toWei(value, 'ether'), from: accounts[0] });
      } catch (err) {
        alert('ERROR: ' + err.message);
      }

      alert('this char is urs, ' + accounts[0]);
    }
  };

  render() {
    return (
      <div className="App">
        <Header user={this.state.loggedUserAccount} />
        <Web3Provider>
          <p className="App-intro">Bid Your Waifu!</p>
          <div className="card-wrapper">
            {this.state.characters.map(character => (
              <Card
                character={character}
                pickCharacter={() => this.pickCharacter(character)}
                toggleModal={this.toggleModal}
                loggedUser={this.state.loggedUserAccount}
              />
            ))}
          </div>
          {this.state.showBuyModal && (
            <div>
              <div onClick={this.toggleModal} className="App-overlay" />
              <div className="App-modal">
                <h4>Buy {this.state.selectedCharacter.name}?</h4>
                <p>
                  You can buy this character starting from the current value +
                  0.001 ETH
                </p>
                <form onSubmit={this.buySelectedCharacterValue}>
                  <div>
                    <input
                      type="text"
                      onChange={this.setSelectedCharacterValue}
                      value={this.state.selectedCharacter.value}
                    />{" "}
                    ETH
                  </div>
                  <button>BUY</button>
                </form>
                <span style={{ opacity: 0.7 }}>
                  note: your money will be transferred to the previous owner of
                  this character.
                </span>
                <img
                  src="https://lh6.googleusercontent.com/0g9_JEL0ItT1qUU9NI-gZhVaT913XY2JrvtMmTBRx9auBjU98nK6PJQF12K_RMu3DIK3Gef61AecLpDAJ1I=w1441-h804-rw"
                  style={{
                    height: "45%",
                    position: "absolute",
                    bottom: 0,
                    right: 0
                  }}
                />
              </div>
            </div>
          )}
        </Web3Provider>
      </div>
    );
  }
}

export default App;
