import React, { Component } from 'react';
import { view } from 'react-easy-state'
import Store from './../../Store';
import { tracksForSong, show } from './../../api/phishin';
import { songFilters } from './../../filters';
import {isTrackJamchart, isTrackSoundboard, getLikesPercent, msToSec} from './../../Utils';
import {NavLink} from 'react-router-dom';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'
import './../../css/Songs.css';
import 'react-select/dist/react-select.css';
import Spinner from 'react-spinkit';

class Songs extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tracks: null,
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
        tracks: null,
        loading: false
      });
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

  handleChange = (filterOption) => {
    this.sortShows(filterOption.attr);
    this.setState({ filterOption: filterOption });
  }

  setFilterDisplay = (title) => {
    this.setState({filterDisplay: title});
  }

  renderTracks = () => {
    let tracks = this.state.tracks;
    return tracks.map(track => {
      return (
        <li className="show-container-item" key={track.id}>
          <div className="show-information-control image-cell">
            <img
              src={'https://s3.amazonaws.com/hose/images/' + track.show_date + '.jpg'}
              className="image-cell"
              alt={track.show_id}
              id={track.id}
            />
            <div className="show-information">
              <div className="center-abs">
                {Store.isTrackPlaying(track) ? 
                  <div className="play-button" onClick={(e) => {
                    Store.pause();
                  }}>
                    <Ionicon 
                      icon="ios-pause" 
                      fontSize="25px" 
                      color="white"
                    />
                  </div>
                :
                  <div className="play-button" onClick={(e) => {
                    Store.playTrack(track.show_id, track);
                  }}>
                    <Ionicon 
                      icon="ios-play" 
                      fontSize="25px" 
                      color="white"
                    />
                  </div>
                }
              </div>
            </div>
          </div>
          <span className="playing-cell">
            {Store.isTrackPlaying(track) ?
              <Spinner color='#4CAF50' name='line-scale-pulse-out-rapid' />
              : null
            }
          </span>
          <span className="title-cell">{track.title}</span>
          <NavLink className="title-cell" to={'/show/' + track.show_id}><span>{track.show_date}</span></NavLink>
          <span className="jamcharts-cell">{isTrackJamchart(track.id) ? "Jamcharts" : ""}</span>
          <span className="jamcharts-cell">{isTrackSoundboard(track.id) ? "Soundboard" : ""}</span>
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
                  style={{width: getLikesPercent(tracks, track.likes_count)}}
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
      <ul className="playlist-section">
        <li className="show-container-item header-cell">
          <span className="image-cell-header"></span>
          <span className="playing-cell"></span>
          <span className="title-cell">Song</span>
          <span className="title-cell" onClick={() => {this.sortShows('date')}}>Date</span>
          <span className="jamcharts-cell" onClick={() => {this.sortShows('jamcharts')}}>Jamcharts</span>
          <span className="jamcharts-cell" onClick={() => {this.sortShows('soundboard')}}>Soundboard</span>
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
        {this.state.loading ? 
        <div style={{position:'fixed', top:'50%', left: '50%', transform: 'translate(-50%, 50%)'}} >
          <Spinner fadeIn='none' name='ball-pulse-rise' />
        </div>
        :
        <div className="tracks-container" ref="tracks">
          {this.state.filterDisplay ?
            <div className="filter-display">
              {this.state.filterDisplay}
            </div> : null
          }

          {tracks ? 
            this.renderTrackContainer(tracks)
            : 
            <div className="tracks-container">Choose a song from the list!</div>
          }
        </div>
        }
      </div>
    );
  }
}

export default view(Songs)