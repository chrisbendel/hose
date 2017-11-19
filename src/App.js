import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Main from './components/Main';

import './css/Main.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div id="outer-container" className="Container">
          <Sidebar />
          <Main />
          <Redirect from="/" to="/years"/>
        </div>
      </Router>
    );
  }
}
