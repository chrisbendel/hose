import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import history from './History';
import SideNav from './components/SideNav/SideNav';
import Header from './components/Header/Header';
import Player from './components/Footer/Player';
import routes from './Routes';
import './css/Main.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <div className="top-container">
            <SideNav />
            
            <div className="page-container">
              <header className="header">
                <Header />
              </header>
              <main className="content">
                {routes}
              </main>
            </div>
          </div>
          <footer className="player">
            <Player /> 
          </footer>
        </div>
      </Router>
    );
  }
}
