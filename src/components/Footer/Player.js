import React, { Component } from 'react';
import './../../css/Player.css'
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import ReactDOM from 'react-dom';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'

//TODO Event emitter listeners, then implement whenever clicking "play" on a song or show
//maybe support one custom playlist and one current show playlist
export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: null,
      show: null,
      downloading: false,
      currentPosition: 0
    }

    this.props.emitter.addListener('playlistUpdate', (showId, position = 0) => {
      this.fetchShowTracks(showId, position);
    });

    setInterval(() => {
      if (this.player && (this.player.state.playing == true)) {
        this.getPlaylistPosition();
      }
    }, 1000)
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
        show: show,
        currentPosition: position
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

  getPlaylistPosition = () => {
    if (this.state.currentPosition != this.player.state.currentPlaylistPos) {
      this.props.emitter.emit('newSong', this.player.state.currentPlaylistPos);
      this.setState({currentPosition: this.player.state.currentPlaylistPos});
    }
  }

  renderPlaylistContent = (set) => {
    return this.state.show.tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <li 
          className="playlist-container-item" 
          key={track.src}
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
        <div>
          <p> {set} </p>
          <ul className="playlist-section"> {that.renderPlaylistContent(set)} </ul>
        </div>
      )
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
        <Ionicon className={this.state.downloading ? "" : "hidden"} icon="ios-refresh" fontSize="60px" rotate={true} />
        <Ionicon className={this.state.downloading ? "hidden" : "clickable"} icon="ios-cloud-download" fontSize="60px" onClick={() => window.confirm("Download this show?") ? this.downloadShow() : null}/>
        <Audio
          ref={audioComponent => { this.player = audioComponent; }}
          width={500}
          height={50}
          autoPlay={true}
          playlist={tracks}
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
        <Ionicon className="clickable" icon="ios-alert" fontSize="60px" onClick={console.log(this.player)}/>
      </div>
    );
  }
}