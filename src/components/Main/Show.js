import React, { Component } from 'react';
import './../../css/Show.css';
import { NavLink } from 'react-router-dom';
import { show, randomShow } from './../../api/phishin';
import { showDetails } from './../../api/phishnet';
import Ionicon from 'react-ionicons';
import {trackJamcharts, tourFilters} from './../../filterOptions';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import {history} from './../../History';
import Interweave from 'interweave';
import PlayerInfo from './../../PlayerInfo';
import {emitter} from './../../Emitter';
import Spinner from 'react-spinkit';
import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import {saveAs} from 'file-saver'
import isElectron from 'is-electron';

if (isElectron()) {
  var {ipcRenderer, remote} = window.require('electron');
  var remoteWindow = remote.getCurrentWindow();
}

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
      showDetails: null,
      playing: false
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
      // console.log(show, track, position, playing);
      this.setState({
        playingShow: show,
        playingTrack: track,
        playingPosition: position,
        playing: playing
      });
    });

    // let info = PlayerInfo.getInfo();
    // this.setState({
    //   playingShow: info.show,
    //   playingTrack: info.track,
    //   playingPosition: info.position,
    //   playing: info.playing
    // });
    
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
      // console.log(PlayerInfo.isPlaying(), PlayerInfo.getPosition(), track.position, PlayerInfo.getShow(), show.id)
      return (
        <li
          className={
              PlayerInfo.isPlaying() && PlayerInfo.getPosition() === track.position && PlayerInfo.getShow().id === this.state.show.id
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
                  PlayerInfo.updateShowAndPosition(e, show.id, track.position);
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
                  PlayerInfo.pause();
                  this.setState({playing: true});
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
        remoteWindow.setProgressBar(count / tracks.length);
        if (count === tracks.length) {
          zip.generateAsync({type:'blob'}, (metadata) => {
            remoteWindow.setProgressBar(metadata.percent);
          })
          .then(content => {
            saveAs(content, showName + ".zip");
            remoteWindow.setProgressBar(-1);
          });
        }
      });
    });
  }

  renderShowInfo = () => {
    return (
      <div>
        <h5 className="clickable" onClick={() => {history.push('/shows/today/' + this.state.show.date)}}> Shows this Day </h5>
        <h5><a style={{textDecoration: 'none', color: '#BDBDBD'}} target="_blank" href={this.state.showDetails.link}>View on Phish.net</a></h5>
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

    let details = this.state.showDetails;
    
    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(show.date + ' 00:00');

    PlayerInfo.getShow();
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
            <h3 className="clickable" onClick={() => {history.push('/venues/' + show.venue.id)}}>{show.venue.name}</h3>
            <h4>{details.location}</h4>
            <div className="btn-container">
              <button 
                className="play-btn-lrg green clickable"
                onClick={(e) => {
                  PlayerInfo.updateShowAndPosition(e, show.id);
                  this.setState({playing: true});
                }}
              >
                Play
              </button>
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