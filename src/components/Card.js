import React from 'react';
import web3 from '../web3';

export default ({ character, pickCharacter, loggedUser }) => (
  <div
    key={character.id}
    className="card">
    <img src={character.avatarUrl} />
    <h3>{character.name}</h3>
    <div className="value">
      {character.value} ETH
    </div>
    <span style={{ fontSize: 12, margin: 20 }}>
      owner: {character.owner.slice(0, 10)}...
    </span>
    {loggedUser !== character.owner && <button onClick={pickCharacter}>
      Get me !
    </button>}
    {loggedUser === character.owner && <button disabled onClick={() => {}} style={{ color: 'white', background: 'grey', borderColor: 'transparent' }}>
      I'm yours! :)
    </button>}
  </div>
);