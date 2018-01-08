import React, { Component } from 'react';
import './../../css/Player.css';
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import ReactDOM from 'react-dom';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import {emitter} from './../../Emitter';
import {history} from './../../History';
import PlayerInfo from './../../PlayerInfo';
import isElectron from 'is-electron';
import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import {saveAs} from 'file-saver'

if (isElectron()) {
  var {remote} = window.require('electron');
  var remoteWindow = remote.getCurrentWindow();
}

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: null,
      show: null,
      downloading: false,
      hoverVenue: false,
      hoverDate: false
    }

    emitter.addListener('pause', () => {
      this.pause();
    });

    emitter.addListener('play', () => {
      this.play();
    });

    emitter.addListener('next', () => {
      this.skipToNext();
    });

    emitter.addListener('prev', () => {
      this.skipToPrevious();
    });

    emitter.addListener('playlistUpdate', (showId, position) => {
      if (this.state.show != null) {
        if (this.state.show.id === showId && this.player.state.currentPlaylistPos === position) {
          this.play();
          return;
        }
      }
      
      this.setShow(showId, position);
    });
  }

  setPlayerInfo = () => {
    if (this.player) {
      let show = this.state.show;
      let playerState = this.player.state;

      let currentPosition = playerState.currentPlaylistPos + 1;
      let currentTrack = show.tracks.find(track => {
        return track.position === currentPosition;
      });
      
      PlayerInfo.setPosition(currentPosition);
      PlayerInfo.setShow(show);
      PlayerInfo.setTrack(currentTrack);
      PlayerInfo.setPlaying(playerState.playing);

      emitter.emit('songUpdate', show, currentTrack, currentPosition, playerState.playing);
    }
  }

  componentWillUnmount() {
    const venue = this.refs.hoverVenue;
    const date = this.refs.hoverDate;

    venue.removeEventListener('animationend', this.stopScroll);
    date.removeEventListener('animationend', this.stopScroll);
  }
  
  componentDidUpdate() {
    if (this.refs.hoverVenue && this.refs.hoverDate) {
      const venue = this.refs.hoverVenue;
      const date = this.refs.hoverDate;
  
      venue.addEventListener('animationend', () => {
        this.stopScroll('hoverVenue');
      });

      date.addEventListener('animationend', () => {
        this.stopScroll('hoverDate');
      });
    }

    if (this.player) {
      let element = this.player.audioElement;
      
      element.addEventListener('playing', this.setPlayerInfo);
      element.addEventListener('play', this.setPlayerInfo);
      element.addEventListener('pause', this.setPlayerInfo);

      // Unbind event listeners, @Jonah TODO idk what to do with these
      // element.removeEventListener('playing', this.setPlayerInfo)
      // element.removeEventListener('play', this.setPlayerInfo)
      // element.removeEventListener('pause', this.setPlayerInfo)
    }
  }

  play = (e) => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-play'));
      this.setPlayerInfo();
    }
  }

  pause = (e) => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-pause'));
      this.setPlayerInfo();
    }
  }
  
  skipToNext = (e) => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-next'));
      this.setPlayerInfo();
    }
  }

  skipToPrevious = (e) => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-previous'));
      this.setPlayerInfo();
    }
  }

  setShow = (showId, position = 0) => {
    show(showId).then(show => {
      let tracks = show.tracks.map(track => {
        return {id: track.id, name: track.title, src: track.mp3}
      });
      
      this.setState({
        tracks: tracks, 
        show: show
      }, () => {
        this.setPlaylistPosition(position);
      });
    }).then(() => {
      this.setPlayerInfo();
    });
  }

  setPlaylistPosition = (index) => {
    this.player.state.currentPlaylistPos = index;
    this.pause();

    if (this.player.state.playing) {
      this.skipToNext();
      this.skipToPrevious();
    } else {
      this.skipToNext();
      this.skipToPrevious();
      this.play();
    }
  }

  downloadShow = () => {
    this.setState({downloading: true})
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
            this.setState({downloading: false});
          });
        }
      });
    });
  }

  renderPlaylistContent = (set) => {
    return this.state.show.tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <li
          className="playlist-container-item" 
          key={track.position}
          onClick={() => {
            this.setPlaylistPosition(track.position - 1);
          }}
        >
          <span> {track.position} - </span>
          <span>{track.title}</span>
        </li>
      );
    });
  }

  renderPlaylistContainer = () => {
    let that = this;
    const sets = [...new Set(this.state.show.tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <div key={set}>
          <p> {set} </p>
          <ul className="playlist-section"> {that.renderPlaylistContent(set)} </ul>
        </div>
      )
    });
  }

  stopScroll = (target) => {
    this.setState({
      [target]: false
    });
  }
  
  render() {
    let show = this.state.show;
    let tracks = this.state.tracks;
    
    if (!show) {
      return (<div> Pick a show or song to start listening </div>);
    }

    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(show.date + ' 00:00');

    return (
      <div className="controls-container">
        <div className="show-information-player">
          <div className="album-art-container clickable" onClick={() => {history.push('/show/' + show.id)}}>
            <img alt={show.date} src={'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}/>
          </div>
          <div className="current-track-information">
            <div 
              ref='hoverDate'
              className={this.state.hoverDate ? "inline-wrapper hovering" : "inline-wrapper"}
              onMouseEnter = {() => {this.setState({hoverDate: true})}}
            >
              <span 
                onClick={() => {history.push('/show/' + show.id)}}
                className="clickable"
              > 
                {date.toLocaleDateString('en-US', dateOptions)}  
              </span>
              <span 
                onClick={() => {history.push('/show/' + show.id)}}
                className="clickable"
              > 
                {date.toLocaleDateString('en-US', dateOptions)}  
              </span>
            </div>
            <div 
              className="inline-wrapper"
              ref='hoverVenue'
              className={this.state.hoverVenue ? "inline-wrapper hovering" : "inline-wrapper"}
              onMouseEnter = {() => {this.setState({hoverVenue: true})}}
            >
              <span className="clickable" 
                onClick={() => {history.push('/shows/venue/' + show.venue.id)}}> {show.venue.name}, {show.venue.location} 
              </span>
              <span className="clickable" 
                onClick={() => {history.push('/shows/venue/' + show.venue.id)}}> {show.venue.name}, {show.venue.location} 
              </span>
            </div>
          </div>
        </div>
        <div className="center-container">
          <Audio
            ref={audioComponent => { this.player = audioComponent; }}
            width={500}
            height={50}
            autoPlay={true}
            playlist={tracks}
            color="#000"
          />
        </div>
        <div className="right-content">
          <Tooltip
            trigger="click"
            interactive
            inertia={true}
            arrow={true}
            animation="scale"
            theme="light"
            arrowSize={"big"}
            duration={200}
            html={<div className="playlist-container">{this.renderPlaylistContainer()}</div>}
          >
            <Ionicon className="clickable right-icon" icon="ios-list-box" fontSize="60px"/>
          </Tooltip>
          <Ionicon className={this.state.downloading ? "right-icon" : "hidden"} icon="ios-refresh" fontSize="60px" rotate={true} />
          <Ionicon className={this.state.downloading ? "hidden" : "clickable right-icon"} icon="ios-cloud-download" fontSize="60px" onClick={() => window.confirm("Download " + show.date + "?" ) ? this.downloadShow() : null}/>
        </div>
      </div>
    );
  }
}