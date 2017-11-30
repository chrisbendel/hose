import React, { Component } from 'react';
import './../../css/Show.css';
import { NavLink } from 'react-router-dom';
import { show, randomShow } from './../../api/phishin';
import { showDetails } from './../../api/phishnet';
import Ionicon from 'react-ionicons';
import {trackJamcharts, tourFilters} from './../../filterOptions';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import Interweave from 'interweave';
import PlayerInfo from './../../PlayerInfo';
import {emitter} from './../../Emitter';

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
      currentTrack: null,
      playing: false,
      showDetails: null
    }
  }

  componentWillReceiveProps(nextProps) {
    let nextId = nextProps.match.params.id;
    if (nextId === 'random') {
      this.fetchRandomShow();
    }
  }

  componentDidUpdate() {
  }

  componentWillMount() {
    if (this.props.match.params.id === 'random') {
      this.fetchRandomShow();
    } else {
      this.fetchShow(this.props.match.params.id);
    }
  }

  fetchShow = (id) => {
    return show(id).then(show => {
      showDetails(show.date).then(details => {
        this.setState({show: show, showDetails: details})
      })
    });
  }

  fetchRandomShow = () => {
    return randomShow().then(show => {
      showDetails(show.date).then(details => {
        this.setState({show: show, showDetails: details})
      })
    })
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

    return tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <li
          className={
              this.state.playing && this.state.currentTrack === track.position
              ? "show-container-item playing" 
              : "show-container-item"
            } 
          key={track.position}
        >
          <span className="play-cell">
            <span className="play-button-sm">
              <Ionicon
                style={{cursor: 'pointer'}}
                icon="ios-play"
                font-size="40px"
                onClick={() => {
                  this.getPlayerInfo();
                  PlayerInfo.updateShowAndPosition(show.id, track.position);
                  this.setState({playing: true, currentTrack: track.position});
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
                  this.getPlayerInfo();
                  emitter.emit('pause');
                  this.setState({playing: false, currentTrack: track.position});
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

  getPlayerInfo = () => {
    console.log(PlayerInfo.getShow());
    console.log(PlayerInfo.getTrack());
    console.log(PlayerInfo.getPosition());
    this.setState({
      playingShow: PlayerInfo.getShow(),
      playingTrack: PlayerInfo.getTrack(),
      playingPosition: PlayerInfo.getPosition()
    });
  }

  render() {
    if (!this.state.show) {
      return (<div>Loading ...</div>)
    }

    let show = this.state.show;
    let details = this.state.showDetails;
    console.log(show);

    PlayerInfo.getShow();
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
            <p> Location: {details.location} </p>
            <NavLink
              key={show.id} 
              to={'/shows/tour/' + show.tour_id}
            >
              <p>{getTourName(show.tour_id)}</p>
            </NavLink>

            {/* 
            TODO: @Jonah
            Put these over the image like they are on the list
            <p> {show.tags} </p>
            <p> {show.remastered ? "Remastered" : null} </p>
            <p> {show.sbd ? "Soundboard" : null} </p> */}
            <b> Notes </b>
            <Interweave
              tagName="div"
              content={details.setlistnotes}
            />
          </div>
        </div>
        <div className="show-tracks">
          {this.renderTrackContainer()}
        </div>
      </div>
    );
  }
}

const getTourName = (id) => {
  return tourFilters.find(tour => {
    return tour.value === id;
  }).label;
}