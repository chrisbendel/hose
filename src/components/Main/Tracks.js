import React, { Component } from 'react';
import { view } from 'react-easy-state'
import Store from './../../Store';
import { tracksForSong } from './../../api/phishin';
import { songFilters } from './../../filters';
import {isTrackJamchart, isTrackSoundboard, getLikesPercent, msToSec} from './../../Utils';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import TrackList from './TrackList';

import './../../css/Songs.css';
import Spinner from 'react-spinkit';

class Tracks extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tracks: [],
      filterOption: '',
      filterDisplay: null,
      likesOrder: false,
      timeOrder: false,
      dateOrder: false,
      jamcharts: false,
      soundboard: false,
      loading: false,
      playing: false
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

  fetchTracks = (song) => {
    this.setState({loading: true});
    if (song) {
      tracksForSong(song).then(tracks => {
        if (tracks.length) {
          this.setState({
            tracks: tracks,
            trackId: song,
            filterDisplay: tracks[0].title,
            loading: false,
          });
        }
      });
    } else {
      this.setState({
        tracks: [],
        loading: false
      });
    }
  }
  
  sortTracks = (attr) => {
    let tracks = this.state.tracks;

    if (attr === 'date') {
      let sorted = tracks.sort((a, b) => {
        var c = new Date(a.show_date);
        var d = new Date(b.show_date);
        if (this.state.dateOrder) {
          return c-d;
        } else {
          return d-c;
        }
      });

      this.setState({
        tracks: sorted,
        dateOrder: !this.state.dateOrder
      })
    }

    if (attr === 'duration') {
      let sorted = tracks.sort((a, b) => {
        if (this.state.timeOrder) {
          return parseFloat(a.duration) - parseFloat(b.duration);
        } else {
          return parseFloat(b.duration) - parseFloat(a.duration);
        }
      });
      this.setState({
        tracks: sorted,
        timeOrder: !this.state.timeOrder
      });
    }
    
    if (attr === 'jamcharts') {
      if (!this.state.jamcharts) {
        let sorted = tracks.filter(track => {
          return isTrackJamchart(track.id);
        });

        this.setState({
          tracks: sorted,
          jamcharts: !this.state.jamcharts
        });
      } else {
        this.setState({jamcharts: !this.state.jamcharts})
        this.fetchTracks(this.state.trackId);
      }
    }

    if (attr === 'soundboard') {
      if (!this.state.soundboard) {
        let sorted = tracks.filter(track => {
          return isTrackSoundboard(track.id);
        });

        this.setState({
          tracks: sorted,
          soundboard: !this.state.soundboard
        });
      } else {
        this.setState({soundboard: !this.state.soundboard});
        this.fetchTracks(this.state.trackId);
      }
    }

    if (attr === 'likes_count') {
      let sorted = tracks.sort((a, b) => {
        if (this.state.likesOrder) {
          return parseFloat(a.likes_count) - parseFloat(b.likes_count);
        } else {
          return parseFloat(b.likes_count) - parseFloat(a.likes_count);
        }
      });
      this.setState({
        tracks: sorted,
        likesOrder: !this.state.likesOrder
      });
    }
  }

  handleChange = filterOption => {
    this.sortTracks(filterOption.attr);
    this.setState({ filterOption: filterOption });
  }

  setFilterDisplay = (title) => {
    this.setState({filterDisplay: title});
  }

  render() {
    let tracks = this.state.tracks;

    if (this.state.loading) {
      return (
        <div style={{position:'fixed', top:'50%', left: '50%', transform: 'translate(-50%, 50%)'}} >
          <Spinner fadeIn='none' name='ball-pulse-rise' />
        </div>
      );
    }

    return (
      <div>
        <div className="filters">
          <div className="scroll-top" onClick={() => {
            if (this.refs.tracks) {
              this.refs.tracks.scrollTop = 0;
            }
          }}>
            <Ionicon icon="ios-arrow-up" fontSize="40px"/>
          </div>
          <div className="search-filter">
            <Filter 
              setTitle={this.setFilterDisplay.bind(this)}
              name={"Songs"}
              path={"/song/"}
              placeholder={"Search For Song"}
              options={songFilters}
            />
          </div>
        </div>

        <div className="tracks-container" ref="tracks">
          {this.state.filterDisplay &&
            <div className="filter-display">
              {this.state.filterDisplay}
            </div>
          }

          {tracks && <TrackList sortTracks={this.sortTracks.bind(this)} tracks={tracks}/>}
        </div>
      </div>
    );
  }
}

export default view(Tracks)