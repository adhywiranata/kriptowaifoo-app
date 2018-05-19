import React from 'react';

export default ({ user }) => (
  <header className="App-header">
    <div>
      <h1 className="App-title"><strong>Lapak</strong>Waifu <strong>:)</strong></h1>
    </div>
    <nav>
      <ul>
        <a href="#"><li>Trending</li></a>
        <a href="#"><li>New</li></a>
        <a href="#"><li>Lolis</li></a>
        <a href="#"><li>My Waifus</li></a>
      </ul>
      <span style={{ paddingLeft: 20, borderLeft: '3px solid white' }}>
        Welcome, {user}
      </span>
    </nav>
  </header>
);