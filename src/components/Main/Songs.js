import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import { view } from 'react-easy-state'
import { tracksForSong } from './../../api/phishin';
import { songFilters } from './../../filters';
import {isTrackJamchart, isTrackSoundboard} from './../../Utils';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import TrackList from './TrackList';

import './../../css/Songs.css';
import Spinner from 'react-spinkit';

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

class Songs extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      songs: songFilters
    }
  }

  clearSearch = () => {
    this.refs.search.value = "";
    this.setState({
      songs: songFilters
    });
  }

  onKeyup = e => {
    if (e.keyCode === 8) {
      let filtered = songFilters.filter(song => {
        return song.label.fuzzy(e.target.value);
      });

      this.setState({
        songs: filtered
      });
    }
  }

  filterSongs = e => {
    let search = e.target.value;

    if (!search) {
      return this.setState ({
        songs: songFilters
      });
    }

    let filtered = this.state.songs.filter(song => {
      return song.label.fuzzy(search);
    });
    
    this.setState({
      songs: filtered
    });
  }

  renderSongs = () => {
    return this.state.songs.map(song => {
      return (
        <NavLink to={"/song/" + song.value} key={song.value + song.label} className="song-item">
          <span className="song-name">{song.label}</span>
          <span>{song.count}</span>
        </NavLink>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="filters">
          <div className="scroll-top" onClick={() => {
            if (this.refs.songs) {
              this.refs.songs.scrollTop = 0;
            }
          }}>
            <Ionicon icon="ios-arrow-up" fontSize="40px"/>
          </div>
          <input ref="search" className="song-search" type="text" placeholder="Search for a song" onKeyUp={this.onKeyup} onChange={this.filterSongs}/>
          <Ionicon className="clickable" icon="ios-close" fontSize="40px" onClick={this.clearSearch}/>
        </div>

        <div className="songs-container" ref="songs">
          <ul>
            <li className="song-item">
              <h3>Song</h3>
              <h3>Times Played</h3>
            </li>
            {this.renderSongs()}
          </ul>
        </div>
      </div>
    );
  }
}

export default view(Songs)