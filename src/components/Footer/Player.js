import React, { Component } from 'react';
import './../../css/Player.css'
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import ReactDOM from 'react-dom';
import { Tooltip } from 'react-tippy';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import {saveAs} from 'file-saver'
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


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
      confirm: false,
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

  downloadShow() {
    var zip = new JSZip();
    let tracks = this.state.tracks;
    let show = this.state.show;
    let showName = show.date +  " " + show.venue.name + " " + show.venue.location;
    
    let count = 0;


    tracks.forEach(function (track) {
      let filename = track.name + ".mp3";

      JSZipUtils.getBinaryContent(track.src, function (err, data) {
        zip.file(filename, data, {binary:true});
        count++;
        if (count == tracks.length) {
          zip.generateAsync({type:'blob'}).then(function(content) {
            let url = URL.createObjectURL(content);
            let options = [{fileName: showName}];
            window.ipcRenderer.send('download', url, options);
            // saveAs(content, showName + ".zip");
          });
        }
      });
    });

    this.setState({downloading: false});
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
        {
          this.state.confirm &&
          <ReactConfirmAlert
            title={show.date +  " " + show.venue.name + " " + show.venue.location}
            message="Download this show?"
            confirmLabel="Download"
            cancelLabel="Cancel"
            onConfirm={() => {
              this.setState({downloading: true, confirm: false});
              this.downloadShow()
            }}
            onCancel={() => this.setState({confirm: false})}
          />
        }
        <Ionicon shake={this.state.downloading} className={this.state.downloading ? "disabled" : "clickable" } icon="ios-cloud-download" fontSize="60px" onClick={() => this.setState({confirm: true})}/>
      </div>
    );
  }
}