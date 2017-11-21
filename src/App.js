import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import history from './History';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import Header from './components/Header/Header';
import Player from './components/Footer/Player';

import './css/Main.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <div className="top-container">
            <Sidebar />
            <div className="page-container">
              <header className="header">
                <Header />
              </header>
              <main className="content">
                <Route path="/main/:year" component={Main}/>
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
