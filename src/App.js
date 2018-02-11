import React, { Component } from 'react';
import { view } from 'react-easy-state'
import { Router, Route } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import Player from './components/Footer/Player';
import Show from './components/Main/Show';
import Shows from './components/Main/Shows';
import Songs from './components/Main/Songs';
import Login from './components/User/Login';
import Radio from './components/Radio';
import {history} from './History';
import GlobalSearch from './components/Header/GlobalSearch';
import Spinner from 'react-spinkit';
import './css/Main.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    history.push('/shows');
    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) {
      return (
        <div style={{position:'fixed', top:'50%', left: '50%', transform: 'translate(-50%, 50%)'}} >
          <Spinner fadeIn='none' name='ball-pulse-rise' />
        </div>
      );
    }

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
              <Route exact path="/shows/:type?/:id?" index component={Shows}/>
              <Route exact path="/song/:id?" component={Songs}/>
              <Route exact path="/radio" component={Radio}/>
            </main>
          </div>
        </Router>
        <footer className="footer">
          <Player/>
        </footer>
      </div>
    );
  }
}

export default view(App)