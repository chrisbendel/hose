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

    this.props.emitter.addListener('playlistUpdate', (showId, trackId = null) => {
      this.fetchShowTracks(showId, trackId);
    });
    this.state = {
      tracks: null,
      show: null,
      downloading: false
    }
  }

  setTrack = (trackId, playlist) => {
    let foundSong = false;
    while(foundSong) {
      for (let playlistTrack of this.player.props.playlist) {
        if (playlistTrack.id === trackId) {
          foundSong = true;
          break;
        }
        ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-next'));
      }
    }
  }

  //Use an event emitter here to catch any updates to playlists
  componentDidUpdate() {
    let trackId = '13504';
    let playlist = this.player.props.playlist;
    this.setTrack(trackId, playlist);
  }
  
  fetchShowTracks = (showId, trackId = null) => {
    show(showId).then(show => {
      let tracks = [];

      show.tracks.forEach(function (track) {
        tracks.push({id: track.id, name: track.title, src: track.mp3, img: process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'});
      });

      this.setState({
        tracks: tracks,
        show: show
      })
    }).then(() => {
      if (trackId) {
        this.setTrack(trackId);
      }
    })
  }

  componentWillMount() {
    // this.fetchShowTracks(665);
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
          width={800}
          height={150}
          autoPlay={true}
          playlist={this.state.tracks}
        />
        <Tooltip
          trigger="click"
          interactive
          animation={'fade'}
          html={<ul> {this.renderPlaylistContent()} </ul>}
        >
          <Ionicon className="clickable" icon="ios-list" fontSize="60px" onClick={() => console.log(this.player)}/>
        </Tooltip>
        <Ionicon className={this.state.downloading ? "" : "hidden"} icon="ios-refresh" fontSize="60px" rotate={true} />
        <Ionicon className={this.state.downloading ? "hidden" : "clickable"} icon="ios-cloud-download" fontSize="60px" onClick={() => window.confirm("Download this show?") ? this.downloadShow() : null}/>
      </div>
    );
  }
}