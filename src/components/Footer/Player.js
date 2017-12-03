import React, { Component } from 'react';
import './../../css/Player.css'
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

if (isElectron()) {
  var {ipcRenderer, remote} = window.require('electron');  
}

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: null,
      show: null,
      downloading: false
    }

    emitter.addListener('pause', () => {
      this.pause();
    });

    emitter.addListener('play', () => {
      this.play();
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
  
  componentDidUpdate() {
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
    }
  }

  skipToPrevious = (e) => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-previous'));
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
    
    let urls = [];
    
    show.tracks.forEach(function (track) {
      // ipcRenderer.send('download', {mp3: track.mp3, name: track.title + ".mp3"}, "/" + show.date);
      urls.push(track.mp3);
    });
    let showName = "/" + show.date + "-" + show.venue.name + "-" + show.venue.location;
    ipcRenderer.send('download', urls, showName);
    this.setState({downloading: false});
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
  
  render() {
    let show = this.state.show;
    let tracks = this.state.tracks;

    if (!show) {
      return (<div> Pick a show or song to start listening </div>);
    }

    return (
      <div className="controls-container">
        <Ionicon className={this.state.downloading ? "" : "hidden"} icon="ios-refresh" fontSize="60px" rotate={true} />
        <Ionicon className={this.state.downloading ? "hidden" : "clickable"} icon="ios-cloud-download" fontSize="60px" onClick={() => window.confirm("Download this show?") ? this.downloadShow() : null}/>
        <Audio
          ref={audioComponent => { this.player = audioComponent; }}
          width={500}
          height={50}
          autoPlay={true}
          playlist={tracks}
          color="#000"
        />
        <Tooltip
          trigger="click"
          interactive
          inertia={true}
          arrow={true}
          animation="scale"
          arrowSize={"big"}
          duration={200}
          html={<div className="playlist-container">{this.renderPlaylistContainer()}</div>}
        >
          <Ionicon className="clickable" icon="ios-list-box" fontSize="60px"/>
        </Tooltip>
        <div className="album-art-container clickable" onClick={() => {history.push('/show/' + show.id)}}>
          <img alt={show.date} src={'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}/>
        </div>
        <p className="clickable" onClick={() => {history.push('/show/' + show.id)}}> {show.date}  </p>
        <p className="clickable" onClick={() => {history.push('/shows/venue/' + show.venue.id)}}> {show.venue.name}, {show.venue.location} </p>
      </div>
    );
  }
}