import React from 'react';
import web3 from '../web3';

export default ({ character, pickCharacter }) => (
  <div
    key={character.id}
    className="card">
    <img src={character.avatarUrl} />
    <h3>{character.name}</h3>
    <div className="value">
      {character.value} ETH
    </div>
    <button onClick={pickCharacter}>
      Get me !
    </button>
  </div>
);