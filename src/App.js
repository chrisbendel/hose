import React, { Component } from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import Player from './components/Footer/Player';
import Show from './components/Main/Show';
import Shows from './components/Main/Shows';
import Songs from './components/Main/Songs';
import {history} from './History';
import GlobalSearch from './components/Header/GlobalSearch';
import {emitter} from './Emitter';
import './css/Main.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <div>
            <nav className="left">
              <SideNav />
            </nav>
            <header className="header">
              <GlobalSearch history={history}/>
            </header>
            <main className="content">
                <Route path="/show/:id" component={Show}/>
                <Route path="/shows/:type?/:id?" component={Shows}/>
                <Route path="/song/:id?" component={Songs}/>
            </main>
            <Redirect from="/" to="/shows"/>
          </div>
        </Router>
        <footer className="footer">
          <Player/>
        </footer>
      </div>
    );
  }
}
