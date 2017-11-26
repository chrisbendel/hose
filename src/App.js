import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import Player from './components/Footer/Player';
import Routes from './Routes';
import createHistory from 'history/createBrowserHistory';
import GlobalSearch from './components/Header/GlobalSearch';
import './css/Main.css';

const history = createHistory();

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div className="app">
          <SideNav />
          <div className="content-container">
            <header className="top-container">
              <GlobalSearch history={history}/>
            </header>
            <main className="content">
              {Routes}
            </main>
            <footer className="player">
              <Player />
            </footer>
          </div>
        </div>
      </Router>
    );
  }
}
