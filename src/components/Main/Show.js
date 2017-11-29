import React, { Component } from 'react';
import './../../css/Show.css';
import { show, randomShow } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import {trackJamcharts} from './../../filterOptions';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

const isJamchart = (id) => {
  return (trackJamcharts.indexOf(id) !== -1);
}

const msToSec = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export default class Show extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: null,
      currentPosition: 0,
      currentPlayingSong: null
    }

    this.props.emitter.addListener('positionUpdate', (position) => {
      this.setState({currentPosition: position + 1});
    });

    this.props.emitter.addListener('playlistUpdate', (showId, position = 0) => {
      let tempPos = position+1;
      this.setState({currentPlayingSong: showId.toString() + tempPos.toString()});
    });

    this.props.emitter.addListener('receiveShow', show => {
      console.log(show);
    });

    this.props.emitter.addListener('receivePosition', pos => {
      console.log(pos);
    });
  }

  fetchShow = (id) => {
    show(id).then(show => {
      if (show) {
        this.setState({
          show: show
        })
      }
    });
  }

  fetchRandomShow = () => {
    randomShow().then(show => {
      this.setState({
        show: show
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id === 'random') {
      this.fetchRandomShow();
    }

    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchShow(nextProps.match.params.id);
    }
  }

  componentWillMount() {
    this.props.emitter.emit("getShowId");
    this.props.emitter.emit("getPosition");
    if (this.props.match.params.id === 'random') {
      this.fetchRandomShow();
    } else {
      this.fetchShow(this.props.match.params.id);
    }
  }

  getLikesPercent = (likes) => {
    const max = Math.max.apply(Math,this.state.show.tracks.map(function(o){
      return o.likes_count;
    }));
    let percent = Math.ceil((likes / max) * 100);
    return percent > 0 ? percent + "%" : "5px";
  }

  renderTracks = (set) => {
    let show = this.state.show;
    let tracks = show.tracks;
    let emitter = this.props.emitter;
    
    return tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <li 
          className={this.state.currentPlayingSong === show.id.toString() + track.position.toString() ? "show-container-item playing" : "show-container-item"} 
          key={track.position}
        >
          <span className="play-cell">
            <span className="play-button-sm">
              <Ionicon 
                style={{cursor: 'pointer'}}
                icon="ios-play"
                font-size="40px"
                onClick={() => {
                  emitter.emit('playlistUpdate', show.id, track.position - 1)
                }}
                className="track-play"
              />
            </span>
            <span className="pause-button-sm">
              <Ionicon 
                style={{cursor: 'pointer'}}
                icon="ios-pause"
                font-size="40px"
                onClick={() => {
                  emitter.emit('pauseCurrentSong', show.id, track.position - 1);
                  this.setState({currentPlayingSong: null})
                }}
                className="track-pause"
              />
            </span>
            <span className="track-number">{track.position}</span>
          </span>
          <span className="title-cell">{track.title}</span>
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
    const sets = [...new Set(this.state.show.tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <div key={set}>
          <ul className="playlist-section"> 
            <h2 className="set-name"> {set} </h2>
            <li 
              className="show-container-item header-cell"
            >
              <span className="play-cell">
                #
              </span>
              <span className="title-cell">Title</span>
              <span className="jamcharts-cell"></span>
              <span className="length-cell">
                <Ionicon
                  icon="md-time"
                  color="black"
                />
              </span>
              <span className="likes-cell">
                <Ionicon 
                  icon="md-heart-outline"
                  font-size="30px"
                  color="black"
                />
              </span>
            </li>
            {this.renderTracks(set)} 
          </ul>
        </div>
      )
    });
  }

  render() {
    if (!this.state.show) {
      return (<div>Loading ...</div>)
    }

    let show = this.state.show;

    return (
      <div className="show-container">
        <div className="show-overview">
          <img 
            className="art"
            alt={show.date} src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}
          />
          <div className="show-details">
            <p> Date: {show.date} </p>
            <p> Venue: {show.venue.name} </p>
            <p> Location: {show.venue.location} </p>

            <p> {show.tags} </p>
            <p> {show.remastered ? "Remastered" : null} </p>
            <p> {show.sbd ? "Soundboard" : null} </p>
            <p> Tour : {show.tour} (we can fetch this tour and show information about the tour, possibly using a component) this will link to the tour page with all the shows from that tour</p>
            
          </div>
        </div>
        <div className="show-tracks">
          {this.renderTrackContainer()}
        </div>
      </div>
    );
  }
}
