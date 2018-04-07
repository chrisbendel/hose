import React, { Component } from 'react';
import { view } from 'react-easy-state'
import {search} from './../../api/phishin.js';
import {createToken, getPlaylist, getUserInfo} from './../../api/hose.js';
import {trackJamcharts} from './../../filters';
import {shuffle} from './../../Utils';
import Store from './../../Store';
import Hello from 'hellojs';
import Autosuggest from 'react-autosuggest';
import Ionicon from 'react-ionicons';
import {history} from './../../History';
import Dialog from 'react-dialog';
import 'react-dialog/css/index.css';
import './../../css/Search.css';

let results = [];

String.prototype.fuzzy = function (s) {
  var hay = this.toLowerCase(), i = 0, n = 0, l;
  s = s.toLowerCase();
  for (; l = s[i++] ;) {
    if ((n = hay.indexOf(l, n)) === -1) {
      return false;
    } 
  } 
  return true;
};

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      loginOpen: false
    };
  }

  componentDidMount() {
    Hello.init({
      facebook: '101222444042913'
    });
  }

  handleLogin = () => {
    Hello('facebook').login().then(() => {
      const res = Hello('facebook').getAuthResponse();
      createToken(res.access_token).then(res => {
        localStorage.setItem('jwt', res.token.replace(/"/g, ""));
        getUserInfo().then(user => {
          Store.user = user;
          this.closeLogin();
          window.location.reload();
        });
      })
    });
  }

  logout = () => {
    let logout = window.confirm("Logout?");
    if (logout) {
      localStorage.removeItem('jwt');
      Store.user = null;
      window.location.reload();
    }
  }

  getSuggestions = value => {
    return results.filter(function (res) {
      return res.display.fuzzy(value);
    });
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    search(value).then(data => {
      results = data;
      this.setState({
        suggestions: this.getSuggestions(value)
      });
    })
  };
  
  renderSuggestion = suggestion => {
    return (
      <div>
        {suggestion.display}
      </div>
    )
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    if (suggestion) {
      this.setState({value: ''});
      history.push(suggestion.path);
    }
  }

  getSuggestionValue = (suggestion) => {
    return suggestion.display;
  }

  shouldRenderSuggestions = (value) => {
    return value.trim().length > 3;
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  startRadio = async () => {
    let radio = window.confirm("Start Phish Radio?");
    
    if (!radio) {
      return;
    }

    const playlist = await getPlaylist();
    if (playlist && playlist.songs) {
      Store.setPlaylist(playlist.songs, true);
    } else {
      let randomTracks = shuffle(trackJamcharts);
      let songIds = randomTracks.slice(0, 100);
      Store.setPlaylist(songIds, true);
    }
  }

  openLogin = () => {
    this.setState({loginOpen: true});
  }

  closeLogin = () => {
    this.setState({loginOpen: false});
  }

  render () {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Search for a song, date (Format: 1997-11-17), tour or venue",
      value,
      onChange: this.onChange,
      autoFocus: true
    };

    return (
      <div className="nav">
        <a onClick={() => {history.goBack()}} className="prev">
          <Ionicon icon="ios-arrow-back" fontSize="60px" color="#FFF" />        
        </a>
        <a onClick={() => {history.goForward()}} className="next">
          <Ionicon icon="ios-arrow-forward" fontSize="60px" color="#FFF" />        
        </a>
        <Autosuggest
          highlightFirstSuggestion={true}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
        <p>{Store.user && Store.user.name}</p>
        <div className="header-buttons">
          <div className="header-button">
            <a className="login-button" onClick={() => this.startRadio()}>Phish Radio</a>
          </div>
          <div className="header-button">
            {Store.user ? 
              <a className="login-button" onClick={() => this.logout()}>Logout</a>
            :
              <div>
                <a className="login-button" onClick={() => this.openLogin()}>Login</a>
                {this.state.loginOpen &&
                  <Dialog
                    title="Login to Hose"
                    modal
                    onClose={this.closeLogin}
                    buttons={[{
                      text: 'Close',
                      onClick: () => this.closeLogin()
                    }]}
                  >
                    <button 
                      className="facebook login"
                      onClick={() => this.handleLogin()}>
                      Login with Facebook
                    </button>
                    {/* <button onClick={() => {

                    }}>
                      Google
                    </button> */}
                  </Dialog>
                }
              </div>
            }

          </div>
        </div>
      </div>
    )
  }
}

export default view(Header)