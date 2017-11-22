import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import history from './History';
import SideNav from './components/SideNav/SideNav';
import Header from './components/Header/Header';
import Player from './components/Footer/Player';
import GlobalSearch from './components/Header/GlobalSearch';
import routes from './Routes';
import './css/Main.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <SideNav />
          <div className="top-container">
            <GlobalSearch />

            <Header className="header" />
            <main className="content">
              {routes}
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
