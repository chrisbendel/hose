import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import Header from './components/Header/Header'

import './css/Main.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div id="outer-container" className="Container">
          <Sidebar />
          <div id="page-wrap" className="Content">
            <Header />
            <Route path="/main/:year" component={Main}/>
            <Redirect from="/" to="/main/all"/>
          </div>
        </div>
      </Router>
    );
  }
}
