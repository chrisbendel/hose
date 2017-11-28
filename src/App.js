import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import Player from './components/Footer/Player';
import Show from './components/Main/Show';
import Shows from './components/Main/Shows';
import Songs from './components/Main/Songs';
import createHistory from 'history/createBrowserHistory';
import GlobalSearch from './components/Header/GlobalSearch';
import {EventEmitter} from 'fbemitter';
import './css/Main.css';

const history = createHistory();
const emitter = new EventEmitter();

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
              <Route path="/show/:id" render={(props) =>
                  <Show emitter={emitter} {...props}/>
                }
              />
              <Route path="/shows/:type?/:id?" render={(props) =>
                  <Shows emitter={emitter} history={history} {...props}/>
                }
              />
              <Route path="/song/:id" component={Show}/>
              <Route path="/play/:id" component={Player}/>
          </main>
        </div>
      </Router>
        <footer className="footer">
          <Player emitter={emitter}/>
        </footer>
      </div>
    );
  }
}
