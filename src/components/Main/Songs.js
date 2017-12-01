import React, { Component } from 'react';
import { tracksForSong } from './../../api/phishin';
import { sortByOptions, trackJamcharts, songFilters  } from './../../filterOptions';
import {NavLink} from 'react-router-dom';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'
import './../../css/Songs.css';
import 'react-select/dist/react-select.css';
import {emitter} from './../../Emitter';
import {history} from './../../History';
import PlayerInfo from './../../PlayerInfo';

const isJamchart = (id) => {
  return (trackJamcharts.indexOf(id) !== -1);
}

const msToSec = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export default class Songs extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tracks: null,
      filterOption: '',
      loadingShows: false,
      songSearch: '',
      filterDisplay: null,
      likesOrder: false,
      timeOrder: false,
      dateOrder: false,
      jamcharts: false
    }
  }
  
  componentWillMount = () => {
    let id = this.props.match.params.id;
    this.fetchTracks(id);
  }

  componentWillReceiveProps(nextProps) {
    let nextId = nextProps.match.params.id;
    this.fetchTracks(nextId);
  }

  fetchTracks = (song) => {
    if (song) {
      tracksForSong(song).then(tracks => {
        this.setState({
          tracks: tracks,
          trackId: song
        })
      });
    } else {
      this.setState({tracks: null})
    }
  }
  
  sortShows = (attr) => {
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
      })
    }
    
    if (attr === 'jamcharts') {
      if (!this.state.jamcharts) {
        let sorted = tracks.filter(track => {
          return isJamchart(track.id);        
        })

        this.setState({
          tracks: sorted,
          jamcharts: !this.state.jamcharts
        })
      } else {
        this.setState({jamcharts: !this.state.jamcharts})
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
      })
    }
  }

  handleChange = (filterOption) => {
    this.sortShows(filterOption.attr);
    this.setState({ filterOption: filterOption });
  }

  setFilterDisplay = (title) => {
    this.setState({filterDisplay: title});
  }

  getLikesPercent = (likes) => {
    const max = Math.max.apply(Math,this.state.tracks.map(function(o) {
      return o.likes_count;
    }));
    let percent = Math.ceil((likes / max) * 100);
    return percent > 0 ? percent + "%" : "5px";
  }

  renderTracks = () => {
    let tracks = this.state.tracks;
    return tracks.map(track => {
      return (
        <li className="show-container-item" key={track.show_id}>
          <img alt={track.show_date} className="image-cell" src={process.env.PUBLIC_URL + '/art/' + track.show_date + '.jpg'}/>
          <span className="play-cell">
            <span className="play-button-sm">
              <Ionicon 
                style={{cursor: 'pointer'}}
                icon="ios-play"
                font-size="40px"
                onClick={() => {PlayerInfo.updateShowAndPosition(track.show_id, track.position)}}
                className="track-play"
              />
            </span>
            <span className="pause-button-sm">
              <Ionicon 
                style={{cursor: 'pointer'}}
                icon="ios-pause"
                font-size="40px"
                onClick={() => {emitter.emit('pause')}}
                className="track-pause"
              />
            </span>
          </span>
          <span className="title-cell">{track.title}</span>
          <NavLink className="title-cell" to={'/show/' + track.show_id}><span>{track.show_date}</span></NavLink>
          <span className="jamcharts-cell">{isJamchart(track.id) ? "Jamcharts" : ""}</span>
          <span className="length-cell">{msToSec(track.duration)}</span>
          <span className="likes-cell">
            <Tooltip
              trigger="mouseenter"
              interactive
              inertia={false}
              arrow={true}
              animation="fade"
              arrowSize={"small"}
              duration={200}
              html={<span>{track.likes_count} {track.likes_count === 1 ? "Like" : "Likes"}</span>}
            >
              <div className="likes-bar">
                <div 
                  className="inside-bar"
                  style={{width: this.getLikesPercent(track.likes_count)}}
                >
                </div>
              </div>
            </Tooltip>
          </span>
        </li>
      );
    });
  }

  renderTrackContainer = () => {
    return (
      <ul key='top' className="playlist-section">
        <li key='header' className="show-container-item header-cell">
          <span className="image-cell-header"></span>
          <span className="play-cell"> </span>
          <span className="title-cell">Title</span>
          <span className="title-cell" onClick={() => {this.sortShows('date')}}>Date</span>
          <span className="jamcharts-cell" onClick={() => {this.sortShows('jamcharts')}}>Jamcharts</span>
          <span className="length-cell">
            <Ionicon
              style={{cursor: 'pointer'}}
              icon="md-time"
              color="black"
              onClick={() => {this.sortShows('duration')}}
            />
          </span>
          <span className="likes-cell">
            <Ionicon 
              style={{cursor: 'pointer'}}
              icon="md-heart-outline"
              font-size="30px"
              color="black"
              onClick={() => {this.sortShows('likes_count')}}
            />
          </span>
        </li>
        {this.renderTracks()} 
      </ul>
    )
  }

  setCurrentFilter = (title) => {
    this.setState({currentFilter: title});
  }

  render() {
    let tracks = this.state.tracks;
    
    return (
      <div>
        <div className="filters">
          <Ionicon
            className="clickable"
            icon="ios-arrow-dropup-circle" 
            fontSize="40px"
            onClick={() => {
              //animate this one day
              this.refs.tracks.scrollTop = 0;
            }}
          />
          {this.state.filterDisplay ?
            <div className="filter-display">
              Song: {this.state.filterDisplay}
            </div>
            :
            null
          }
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
        {tracks ? 
          <div className="tracks-container" ref="tracks">
              {this.renderTrackContainer(tracks)}
          </div>
          : 
          <div className="tracks-container">Choose a song from the list!</div>
        }
      </div>
    );
  }
}
