import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">KriptoWaifoo</h1>
        </header>
        <p className="App-intro">
          Bid Your Waifu!
        </p>
        <div>
          <div style={{ padding: 15, margin: 15, border: '1px solid rgba(0,0,0,0.1)' }}>
            REM
          </div>
        </div>
      </div>
    );
  }
}

export default App;
