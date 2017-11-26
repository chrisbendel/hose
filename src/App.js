import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import Player from './components/Footer/Player';
import Show from './components/Main/Show';
import Shows from './components/Main/Shows';
import Songs from './components/Main/Songs';
import Playlist from './components/Playlist';
import createHistory from 'history/createBrowserHistory';
import GlobalSearch from './components/Header/GlobalSearch';
import './css/Main.css';

const history = createHistory();

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <nav className="left">
            <SideNav />
          </nav>
          <header className="header">
            <GlobalSearch history={history}/>
          </header>
          <main className="content">
            <div>
              <Route path="/show/:id" component={Show}/>
              <Route path="/shows" component={Shows}/>
              <Route path="/song/:id" component={Show}/>
            </div>
          </main>
          <footer className="footer">
            <Player />
          </footer>
          <nav className="right">
            <Playlist />
          </nav>
        </div>
      </Router>
    );
  }
}
