import React, { Component } from 'react';
import { view } from 'react-easy-state'
import { Router, Route } from 'react-router-dom';
import SideNav from './components/SideNav/SideNav';
import Player1 from './components/Footer/Player1';
import Show from './components/Main/Show';
import Shows from './components/Main/Shows';
import ShowsOnDay from './components/Main/ShowsOnDay';
import Tracks from './components/Main/Tracks';
import Songs from './components/Main/Songs';
import Radio from './components/Radio';
import {history} from './History';
import Header from './components/Header/Header';
import Spinner from 'react-spinkit';
import Store from './Store';
import {loadWasm} from './Utils';
import { getUser, createModel, getUserInfo, createPlaylist } from './api/hose';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    }
  }
  
  componentDidMount() {
    Store.updateUserLikes();
    getUserInfo().then(user => {
      Store.user = user;
      createModel();
      createPlaylist();
    });
    getUser().then(songs => {
      if (songs) {
        Store.userLikes = songs.filter(song => {
          return song.like
        })
        .map(song => {
          return parseInt(song.song_id, 10)
        });
      }
      this.setState({loading: false});
    });
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
              <Header/>
            </header>
            <main className="content">
              <Route exact path="/" component={Shows}/>
              <Route exact path="/show/:id" component={Show}/>
              <Route exact path="/showsOnDay/:date?" component={ShowsOnDay}/>
              <Route exact path="/shows/:type?/:id?" component={Shows}/>
              <Route exact path="/songs" component={Songs}/>
              <Route exact path="/song/:id?" component={Tracks}/>
              <Route exact path="/radio" component={Radio}/>
            </main>
          </div>
        </Router>
        <footer className="footer">
          {/* <Player/> */}
          <Player1/>
        </footer>
      </div>
    );
  }
}

export default view(App)