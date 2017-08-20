import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Shows from './components/Shows';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import './css/Main.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="Container">
          <Sidebar />
          <Main />
        </div>
      </Router>
    );
  }
}
