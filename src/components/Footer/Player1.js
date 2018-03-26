import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import Store from './../../Store';
import {getTrack, listen, completed, likeTrack, dislikeTrack, skipped} from './../../api/hose';
import {history} from './../../History';
import Ionicon from 'react-ionicons';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

class Player1 extends Component {
  constructor(props) {
    super(props);

    Store.player = this;
  }

  componentDidUpdate() {
    if (this.player) {
      this.player.addEventListener('play', () => {Store.playing = true});
      this.player.addEventListener('pause', () => {Store.playing = false});
    }
  }

  play = () => {
    this.player.play()
  }

  pause = () => {
    this.player.pause()
  }

  render() {
    if (!Store.track) {
      return (
        <div> Help text to show the user what to do. 
          Possibly: Start playing a random show(button), start playing radio(button),
          or just tell them to play something themselves 
        </div>
      );
    }

    console.log(Store.track.mp3);

    return (
      <div className="player-container">
        <audio 
          style={{display: 'none'}}
          ref={player => {this.player = player}}
          src={Store.track.mp3}
          autoPlay={true}
        />
        <Ionicon 
          className="clickable" 
          color="#66BB6A" 
          icon="ios-play" 
          fontSize="60px" 
          onClick={() => {this.play()}}
        />
        <Ionicon 
          className="clickable" 
          color="#66BB6A" 
          icon="ios-pause" 
          fontSize="60px" 
          onClick={() => {this.pause()}}
        />
        <Ionicon 
          className="clickable" 
          color="#66BB6A" 
          icon="ios-skip-backward" 
          fontSize="60px"
          onClick={() => {Store.previous()}}
        />
        <Ionicon 
          className="clickable" 
          color="#66BB6A" 
          icon="ios-skip-forward" 
          fontSize="60px"
          onClick={() => {Store.next()}}
        />
      </div>
    );
  }
}

export default view(Player1)