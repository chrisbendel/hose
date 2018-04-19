import React, { Component } from 'react';
import { view } from 'react-easy-state'
import Store from './../../Store';
import { show, randomShow } from './../../api/phishin';
import { likeTrack } from './../../api/hose';
import Ionicon from 'react-ionicons';
import {test, getLikesPercent, msToSec, isTrackJamchart, isShowJamchart, isShowSoundboard, getTourName, downloadShow} from './../../Utils';
import { Tooltip } from 'react-tippy';
import {history} from './../../History';
import Spinner from 'react-spinkit';
import moment from 'moment';
import './../../css/Show.css';
import './../../css/SongCell.css';
import 'react-tippy/dist/tippy.css';

class Show extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: null,
      playing: false,
      playingShow: null,
      playingTrack: null,
      playingPosition: null
    }
  }

  componentWillReceiveProps(nextProps) {
    let nextId = nextProps.match.params.id;
    if (this.state.show && (nextId !== this.state.show.id)) {
      if (nextId === 'random') {
        this.fetchRandomShow();
      } else {
        this.fetchShow(nextId);
      }
    }
  }

  componentWillMount() {
    test();
    if (this.props.match.params.id === 'random') {
      this.fetchRandomShow();
    } else {
      this.fetchShow(this.props.match.params.id);
    }
  }

  fetchShow = (id) => {
    return show(id).then(show => {
      this.setState({show: show});
    });
  }

  fetchRandomShow = () => {
    return randomShow().then(show => {
      this.setState({show: show});
    });
  }

  renderTracks = set => {
    let show = this.state.show;
    let tracks = show.tracks;
    return tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <li key={track.position} 
            className={
              Store.isTrackPlaying(track)
              ? "show-container-item playing"
              : "show-container-item"
            }
        >
          <span className="position-cell">
            <span className="play-button-sm">
              <Ionicon
                icon="ios-play"
                font-size="60px"
                onClick={e => {
                  Store.playShow(show.id, track.position);
                }}
                className="track-play"
              />
            </span>
            <span className="pause-button-sm">
              <Ionicon 
                icon="ios-pause"
                font-size="60px"
                onClick={() => {
                  Store.pause();
                }}
                className="track-pause"
              />
            </span>
            <span className="track-number">{track.position}</span>
          </span>
          <span className="length-cell">{msToSec(track.duration)}</span>
          <span className="like-cell">
            <Ionicon 
              icon={Store.userLikes.indexOf(track.id) > -1 ? "ios-thumbs-up" : "ios-thumbs-up-outline"}
              font-size="40px"
              color="#4CAF50"
              onClick={() => {
                likeTrack(track.id).then(track => {
                  Store.updateUserLikes();
                });
              }}
            />
          </span>
          <span className="title-cell">{track.title}</span>
          <span className="jamcharts-cell">{isTrackJamchart(track.id) ? "Jamcharts" : ""}</span>
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
    const sets = [...new Set(this.state.show.tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <div key={set}>
          <ul className="set-tracks"> 
            <h2 className="set-name"> {set} </h2>
            <li className="show-container-item">
              <span className="position-cell">#</span>
              <span className="length-cell">
                <Ionicon
                    icon="md-time"
                    color="#BDBDBD"
                  />
              </span>
              <span className="like-cell"></span>
              <span className="title-cell">Song</span>
              <span className="jamcharts-cell"></span>
              <span className="likes-cell">
                <Ionicon 
                  icon="md-heart-outline"
                  color="#BDBDBD"
                />
              </span>
            </li>
            {this.renderTracks(set)} 
          </ul>
        </div>
      )
    });
  }

  renderShowInfo = () => {
    let show = this.state.show;
    return (
      <div>
        <h5 className="clickable" onClick={() => {history.push('/showsOnDay/' + show.date)}}> Shows this Day </h5>
        <h5><a style={{textDecoration: 'none', color: '#BDBDBD'}} target="_blank" href={"https://phish.net/setlists/?d=" + show.date.replace(/\//g, "-")}>View on Phish.net</a></h5>
      </div>
    );
  }

  render() {
    let show = this.state.show;
    
    if (!show) {
      return (
        <div style={{position:'fixed', top:'50%', left: '50%', transform: 'translate(-50%, 50%)'}} >
          <Spinner fadeIn='none' name='ball-pulse-rise' />
        </div>
      );
    }

    return (
      <div className="show-container">
        <div className="show-information-top">
          <div className="show-overview">
            <img className="art" alt={show.date} src={'/images/' + show.date + '.jpg'}/>
          </div>
          <div className="right">
            <h2>{moment(show.date).format('LL')}</h2>
            <p>
              <span style={{marginRight: 5}}>{isShowJamchart(show.id) && "Jamcharts"}</span>
              <span style={{marginRight: 5}}>{isShowSoundboard(show.id) && "Soundboard"}</span>
            </p>
            <h3 className="clickable" onClick={() => {history.push('/shows/venue/' + show.venue.id)}}>{show.venue.name}</h3>
            <h4>{show.venue.location}</h4>
            <h4 className="clickable" onClick={() => {history.push('/shows/tour/' + show.tour_id)}}>{getTourName(show.tour_id)}</h4>
            <div className="btn-container">
              {Store.isShowPlaying(show) ?
                <button 
                  className="play-show-button"
                  onClick={(e) => {
                    Store.player.pause();
                  }}
                  >
                  <span> Pause </span>
                </button>
                : 
                <button 
                  className="play-show-button"
                  onClick={e => {
                    if (Store.track) {
                      Store.playShow(show.id, Store.track.position);
                    } else {
                      Store.playShow(show.id);
                    }
                  }}
                >
                  Play
                </button>
              }
              <button 
                onClick={() => window.confirm("Download " + show.date + "?" ) ? downloadShow(this.state.show) : null}
                className="download-button"
              >
                Download
              </button>
              <Tooltip
                trigger="click"
                interactive
                arrow={true}
                position="right"
                animation="fade"
                theme="light"
                arrowSize={"big"}
                duration={200}
                html={this.renderShowInfo()}
              >
              <button className="more-show-info">
                <Ionicon color="#000" className="more-options clickable" icon="ios-more" />
              </button>
              </Tooltip>
            </div>
          </div>
          {Store.isShowPlaying(show) && <Spinner color='#4CAF50' name='line-scale-pulse-out-rapid' />}
        </div>
        <div className="show-tracks">
          {this.renderTrackContainer()}
        </div>
      </div>
    );
  }
}

export default view(Show)