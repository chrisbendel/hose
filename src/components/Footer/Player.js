import React, { Component } from 'react';
import './../../css/Player.css'
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import ReactDOM from 'react-dom';

//TODO Event emitter listeners, then implement whenever clicking "play" on a song or show
//maybe support one custom playlist and one current show playlist
export default class Player extends Component {
  constructor(props) {
    super(props);

    this.props.emitter.addListener('playlistUpdate', (showId, trackId = null) => {
      // if (trackId) {
        this.fetchShowTracks(showId, trackId);
      // } else {
      //   this.fetchShowTracks(showId);
      // }
    });
    this.state = {
      tracks: null,
      show: null,
      height: 0
    }
  }

  setTrack = (trackId, playlist) => {
    for (let playlistTrack of this.player.props.playlist) {
      if (playlistTrack.id === trackId) {
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
  
  fetchShowTracks = (showId, trackId = null) => {
    show(showId).then(show => {
      console.log(show);
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

  //TODO render the list of tracks currently in the playlist somehow, we can prob use a modal
  //clicking a song in the playlist will call setTrack with the track id
  render() {
    if (!this.state.tracks) {
      return (<div> Pick a show or song to start listening </div>);
    }
    // console.log(ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-next')))
    return (
      <div className="controls-container">
        <Ionicon icon="ios-list" fontSize="35px" onClick={() => console.log(this.player)} color="red"/>
        <Audio
          fullPlayer={true}
          ref={audioComponent => { this.player = audioComponent; }}
          width={800}
          height={150}
          autoPlay={true}
          playlist={this.state.tracks}
        />
      </div>
    );
  }
}