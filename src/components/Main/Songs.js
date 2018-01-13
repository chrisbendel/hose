import React, { Component } from 'react';
import { tracksForSong } from './../../api/phishin';
import { trackJamcharts, songFilters } from './../../filterOptions';
import {NavLink} from 'react-router-dom';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'
import './../../css/Songs.css';
import 'react-select/dist/react-select.css';
import Controls from './../../Controls';
import Spinner from 'react-spinkit';
import {emitter} from './../../Emitter';

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
      filterDisplay: null,
      likesOrder: false,
      timeOrder: false,
      dateOrder: false,
      jamcharts: false,
      loading: false,
      currentTrack: null,
      playing: false
    }
  }
  
  componentDidMount = () => {
    let id = this.props.match.params.id;
    emitter.addListener('songUpdate', (show, track, position, playing) => {
      console.log(track);
      this.setState({
        currentTrack: track,
        playing: playing
      });
    });
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
                {this.state.playing && track.id == this.state.currentTrack.id ? 
                  <div className="play-button" onClick={(e) => {
                    Controls.pause();
                  }}>
                    <Ionicon 
                      icon="ios-pause" 
                      fontSize="25px" 
                      color="white"
                    />
                  </div>
                :
                  <div className="play-button" onClick={(e) => {
                    Controls.updateShowAndPosition(e,track.show_id, track.position);
                  }}>
                    <Ionicon 
                      icon="ios-play" 
                      fontSize="25px" 
                      color="white"
                    />
                  </div>
                }
                <div className="show-likes">
                  <Ionicon 
                    icon="ios-thumbs-up"
                    fontSize="10px"
                    onClick={() => console.log('like clicked')}
                    color="white"
                  />
                  <span className="likes-num"> 
                    {track.likes_count} 
                  </span>
                </div>
              </div>
            </div>
          </div>
          <span className="playing-cell">
            {this.state.playing && track.id == this.state.currentTrack.id ?
              <Spinner color='#4CAF50' name='line-scale-pulse-out-rapid' />
              : null
            }
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
      <ul className="playlist-section">
        <li className="show-container-item header-cell">
          <span className="image-cell-header"></span>
          <span className="playing-cell"></span>
          <span className="title-cell">Song</span>
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
