import React, { Component } from 'react';
import './../../css/Player.css'
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import ReactDOM from 'react-dom';
import {EventEmitter} from 'fbemitter';



export default class Player extends Component {
  constructor(props) {
    super(props);
    let emitter = new EventEmitter();
    emitter.addListener('playlistUpdate')
    this.state = {
      tracks: null,
      show: null,
      height: 0
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchShow(nextProps.match.params.id);
    }
  }

  setTrack(trackId, playlist) {
    for (let playlistTrack of playlist) {
      if (playlistTrack.id == trackId) {
        break;
      }
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-next'));
    }
  }

  //Use an event emitter here to catch any updates to playlists
  componentDidUpdate() {
    let trackId = '13504';
    let playlist = this.player.props.playlist;
    this.setTrack(trackId, playlist);
  }
  
  fetchShowTracks = (id) => {
    show(id).then(show => {
      console.log(show);
      let tracks = [];

      show.tracks.forEach(function (track) {
        tracks.push({id: track.id, name: track.title, src: track.mp3, img: process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'});
      });

      this.setState({
        tracks: tracks,
        show: show
      })
    })
  }

  componentWillMount() {
    this.fetchShowTracks(665);
  }

  render() {
    if (!this.state.tracks) {
      return (<div> loading </div>);
    }
    // console.log(ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-next')))
    return (
      <div className="controls-container">
        <Ionicon icon="ios-add-circle" fontSize="35px" onClick={() => console.log(this.player)} color="red"/>
        <Audio
          // fullPlayer={true}
          ref={audioComponent => { this.player = audioComponent; }}
          width={600}
          height={50}
          autoPlay={false}
          playlist={this.state.tracks}
        />
      </div>
    );
  }
}