import React, { Component } from 'react';
import { Router, Redirect, Route } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import Header from './components/Header/Header';
import Player from './components/Footer/Player';
import Shows from './components/Main/Shows';
import Songs from './components/Main/Songs';
import Eras from './components/Main/Eras';
import createHistory from 'history/createBrowserHistory';
import GlobalSearch from './components/Header/GlobalSearch';
import './css/Main.css';

const history = createHistory();   

export default class App extends Component {
  render() {
    return (
      <Router history={history} forceRefresh={true}>
        <div className="app">
          <SideNav />
          <div className="top-container">
            <GlobalSearch history={history}/>
            <Header className="header" />
            <main className="content">
              <Route path="/shows/:id" component={Shows}/>
              <Route path="/songs/:id" component={Songs}/>
              <Route path="/eras/:id" component={Eras}/>
            </main>
          </div>
          <footer className="player">
            <Player /> 
          </footer>
        </div>
      </Router>
    );
  }
}
