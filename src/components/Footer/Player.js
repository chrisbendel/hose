import React, { Component } from 'react';
import './../../css/Player.css'
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import ReactDOM from 'react-dom';
import { Tooltip } from 'react-tippy';

//TODO Event emitter listeners, then implement whenever clicking "play" on a song or show
//maybe support one custom playlist and one current show playlist
export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: null,
      show: null,
      downloading: false
    }

    this.props.emitter.addListener('playlistUpdate', (showId, position = 0) => {
      this.fetchShowTracks(showId, position);
    });
  }
  
  fetchShowTracks = (showId, position) => {
    if (this.state.show && (showId === this.state.show.id)) {
      this.setPlaylistPosition(position);
    }

    show(showId).then(show => {
      let tracks = [];

      show.tracks.forEach(function (track) {
        tracks.push({id: track.id, name: track.title, src: track.mp3, img: process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'});
      });
      
      this.setState({
        tracks: tracks,
        show: show
      });
      this.setPlaylistPosition(position);
    });
  }

  setPlaylistPosition = (index) => {
    this.player.state.currentPlaylistPos = index;
    ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-pause'));
    ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-next'));
    ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-previous'));
  }

  downloadShow = () => {
    this.setState({downloading: true})
    let tracks = this.state.tracks;
    let show = this.state.show;

    let options = {};
    options.urls = [];
    options.path = show.date;
    tracks.forEach(function (track) {
      options.urls.push(track.src);
    });

    let that = this;
    window.require("electron").remote.require("electron-download-manager").bulkDownload(options, function(error, finished, errors){
      that.setState({downloading: false})
    });
  }

  renderPlaylistContent = () => {
    return this.state.tracks.map(function(track, index) {
      return (
        <li key={track.src}>
          <span>{index} {track.name}</span>
        </li>
      );
    });
  }
  
  render() {
    let show = this.state.show;
    let tracks = this.state.tracks;

    if (!tracks) {
      return (<div> Pick a show or song to start listening </div>);
    }

    return (
      <div className="controls-container">
        <Audio
          fullPlayer={true}
          ref={audioComponent => { this.player = audioComponent; }}
          width={500}
          height={150}
          autoPlay={true}
          playlist={tracks}
        />
        <Tooltip
          trigger="click"
          interactive
          animation={'fade'}
          html={<ul> {this.renderPlaylistContent()} </ul>}
        >
          <Ionicon className="clickable" icon="ios-list" fontSize="60px" onClick={() => this.setPlaylistPosition(0)}/>
        </Tooltip>
        <Ionicon className={this.state.downloading ? "" : "hidden"} icon="ios-refresh" fontSize="60px" rotate={true} />
        <Ionicon className={this.state.downloading ? "hidden" : "clickable"} icon="ios-cloud-download" fontSize="60px" onClick={() => window.confirm("Download this show?") ? this.downloadShow() : null}/>
      </div>
    );
  }
}