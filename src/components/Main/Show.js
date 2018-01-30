import React, { Component } from 'react';
import './../../css/Show.css';
import { show, randomShow } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import {getLikesPercent, msToSec, isTrackJamchart, isShowJamchart, isShowSoundboard, getTourName} from './../../Utils';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import {history} from './../../History';
import Controls from './../../Controls';
import {emitter} from './../../Emitter';
import Spinner from 'react-spinkit';
import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import {saveAs} from 'file-saver'
import isElectron from 'is-electron';

if (isElectron()) {
  var {remote} = window.require('electron');
  var remoteWindow = remote.getCurrentWindow();
}

export default class Show extends Component {
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

  componentWillUnmount() {
    emitter.removeAllListeners('songUpdate');
  }

  componentWillMount() {
    emitter.addListener('songUpdate', (show, track, position, playing) => {
      this.setState({
        playingShow: show,
        playingTrack: track,
        playingPosition: position,
        playing: playing
      });
    });
    
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

  renderTracks = (set) => {
    let show = this.state.show;
    let tracks = show.tracks;
    return tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <li className={
              this.state.playing && Controls.position == track.position && Controls.show.id == show.id
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
                onClick={(e) => {
                  Controls.updateShowAndPosition(e, show.id, track.position);
                  this.setState({playing: true});
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
                  Controls.pause();
                  this.setState({playing: true});
                }}
                className="track-pause"
              />
            </span>
            <span className="track-number">{track.position}</span>
          </span>
          <span className="title-cell">{track.title}</span>
          <span className="jamcharts-cell">{isTrackJamchart(track.id) ? "Jamcharts" : ""}</span>
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
    const sets = [...new Set(this.state.show.tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <div key={set}>
          <ul className="playlist-section"> 
            <h2 className="set-name"> {set} </h2>
            <li className="show-container-item header-cell">
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

  downloadShow = () => {
    let show = this.state.show;
    let tracks = show.tracks;
    var zip = new JSZip();
    let count = 0;
    let showName = show.date + "-" + show.venue.name + "-" + show.venue.location;
    tracks.forEach(track => {
      let title = track.title + ".mp3";
      JSZipUtils.getBinaryContent(track.mp3, (err, data) => {
        zip.file(title, data, {binary: true});
        count++;
        if (isElectron()) {
          remoteWindow.setProgressBar(count / tracks.length);
        }
        if (count === tracks.length) {
          zip.generateAsync({type:'blob'}, (metadata) => {
            if (isElectron()) {
              remoteWindow.setProgressBar(metadata.percent);
            }
          })
          .then(content => {
            saveAs(content, showName + ".zip");
            if (isElectron()) {
              remoteWindow.setProgressBar(-1);
            }
          });
        }
      });
    });
  }

  renderShowInfo = () => {
    let show = this.state.show;
    return (
      <div>
        <h5 className="clickable" onClick={() => {history.push('/shows/today/' + show.date)}}> Shows this Day </h5>
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

    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(show.date + ' 00:00');

    return (
      <div className="show-container">
        <div className="show-information-top">
          <div className="show-overview">
            <img 
              className="art"
              alt={show.date} src={'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}
            />
          </div>
          <div className="right">
            <h2>{date.toLocaleDateString('en-US', dateOptions)}</h2>
            <p>
              <span style={{marginRight: 5}}>{isShowJamchart(show.id) && "Jamcharts"}</span>
              <span style={{marginRight: 5}}>{isShowSoundboard(show.id) && "Soundboard"}</span>
            </p>
            
            <h3 className="clickable" onClick={() => {history.push('/shows/venue/' + show.venue.id)}}>{show.venue.name}</h3>
            <h4>{show.venue.location}</h4>
            <h4 className="clickable" onClick={() => {history.push('/shows/tour/' + show.tour_id)}}>{getTourName(show.tour_id)}</h4>
            <div className="btn-container">
              {this.state.playing ?
                <button 
                  className="play-btn-lrg green clickable"
                  onClick={(e) => {
                    Controls.pause();
                    this.setState({playing: true});
                  }}
                  >
                  <span> Pause </span>
                </button>
                : 
                <button 
                  className="play-btn-lrg green clickable"
                  onClick={(e) => {
                    Controls.updateShowAndPosition(e, show.id);
                    this.setState({playing: true});
                  }}
                >
                  Play
                </button>
              }
              <button 
                onClick={() => window.confirm("Download " + show.date + "?" ) ? this.downloadShow() : null}
                className="play-btn-lrg outline clickable"
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
              <button className="play-btn-lrg round">
                <Ionicon color="#000" className="more-options clickable" icon="ios-more" />
              </button>
              </Tooltip>
            </div>
          </div>
          {this.state.playing
          ?
            <Spinner color='#4CAF50' name='line-scale-pulse-out-rapid' />
          : null
          }
        </div>
        <div className="show-tracks">
          {this.renderTrackContainer()}
        </div>
      </div>
    );
  }
}