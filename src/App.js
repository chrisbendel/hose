import React, { Component } from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import Player from './components/Footer/Player';
import Show from './components/Main/Show';
import Shows from './components/Main/Shows';
import Songs from './components/Main/Songs';
import Login from './components/User/Login';
import Radio from './components/Radio';
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
              <GlobalSearch/>
            </header>
            <main className="content">
                <Route exact path="/show/:id" component={Show}/>
                <Route exact path="/shows/:type?/:id?" component={Shows}/>
                <Route exact path="/song/:id?" component={Songs}/>
                <Route exact path="/radio" component={Radio}/>
                {/* <Route path="/login" component={Login}/> */}
            </main>
            <Redirect from="/" exact to="/shows"/>
          </div>
        </Router>
        <footer className="footer">
          <Player/>
        </footer>
      </div>
    );
  }
}
