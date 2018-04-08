import React, { Component } from 'react';
import { view } from 'react-easy-state'
import { tracksForSong } from './../../api/phishin';
import { songFilters } from './../../filters';
import {isTrackJamchart, isTrackSoundboard} from './../../Utils';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import TrackList from './TrackList';

import './../../css/Songs.css';
import Spinner from 'react-spinkit';

class Tracks extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tracks: null,
      allTracks: null,
      filterOption: '',
      currentFilter: ""
    }
  }
  
  componentDidMount = () => {
    let id = this.props.match.params.id;
    this.fetchTracks(id);
  }

  componentWillReceiveProps(nextProps) {
    let nextId = nextProps.match.params.id;
    this.fetchTracks(nextId);
  }

  fetchTracks = id => {
    tracksForSong(id).then(tracks => {
      this.setState({
        allTracks: tracks,
        tracks: tracks,
        currentFilter: null,
        trackId: id
      });
    });
  }
  
  sortTracks = attr => {
    let tracks = this.state.tracks;
    let allTracks = this.state.allTracks;
    let currentFilter = this.state.currentFilter;

    if (attr === currentFilter) {
      return this.setState({
        tracks: allTracks,
        currentFilter: null
      });
    }

    if (attr === 'duration') {
      let sorted = allTracks.sort((a, b) => {
        return parseFloat(b.duration) - parseFloat(a.duration);
      });

      return this.setState({
        tracks: sorted,
        currentFilter: 'duration'
      });
    }
    
    if (attr === 'jamcharts') {
      let sorted = allTracks.filter(track => {
        return isTrackJamchart(track.id);
      });

      return this.setState({
        tracks: sorted,
        currentFilter: 'jamcharts'
      });
    }

    if (attr === 'soundboard') {
      let sorted = allTracks.filter(track => {
        return isTrackSoundboard(track.id);
      });

      return this.setState({
        tracks: sorted,
        currentFilter: 'soundboard'
      });
    }

    if (attr === 'likes_count') {
      let sorted = allTracks.sort((a, b) => {
        return parseFloat(b.likes_count) - parseFloat(a.likes_count);
      });

      return this.setState({
        tracks: sorted,
        currentFilter: 'likes_count',
      });
    }

    this.fetchTracks(this.state.trackId);
  }
  
  render() {
    let tracks = this.state.tracks;

    if (!tracks) {
      return (
        <div style={{position:'fixed', top:'50%', left: '50%', transform: 'translate(-50%, 50%)'}} >
          <Spinner fadeIn='none' name='ball-pulse-rise' />
        </div>
      );
    }

    return (
      <div>
        <div className="scroll-top" onClick={() => {
          if (this.refs.tracks) {
            this.refs.tracks.scrollTop = 0;
          }
        }}>
          <Ionicon icon="ios-arrow-up" fontSize="40px"/>
        </div>

        <div className="tracks-container" ref="tracks">
          <TrackList 
            sortTracks={this.sortTracks.bind(this)} 
            currentFilter={this.state.currentFilter} 
            songName={tracks[0].title} 
            tracks={tracks}
          />
        </div>
      </div>
    );
  }
}

export default view(Tracks)