import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import Store from './../../Store';
import {getTrack, listen, completed, likeTrack, dislikeTrack, skipped} from './../../api/hose';
import {history} from './../../History';
import Ionicon from 'react-ionicons';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

const timeFormat = time => {
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

class Player1 extends Component {
  constructor(props) {
    super(props);

    Store.player = this;
    let progress = null;
    let duration = null;
  }

  componentDidUpdate() {
    if (this.player) {
      this.player.addEventListener('play', () => {Store.playing = true});
      this.player.addEventListener('pause', () => {Store.playing = false});
      this.player.addEventListener('timeupdate', this.timeUpdate);
      this.player.addEventListener('emptied', this.checkSkipped);
      this.player.addEventListener('ended', this.trackEnded);
      this.prog.addEventListener('click', (e) => {
        var percent = e.offsetX / this.prog.offsetWidth;
        this.player.currentTime = percent * this.player.duration;
        this.prog.value = percent
      });

      // this.player.addEventListener('timeupdate', () => {
        
      // });

      var minutes = Math.floor(this.player.duration / 60),
          seconds_int = this.player.duration - minutes * 60,
          seconds_str = seconds_int.toString(),
          seconds = seconds_str.substr(0, 2),
          time = minutes + ':' + seconds

        this.totalTime.innerHTML = time;
    }
  }

  trackEnded = () => {
    completed(Store.track.id).then(() => {
      Store.next();
    });
  }

  checkSkipped = () => {
    if (this.progress && this.duration) {
      if (this.progress/this.duration < .25) {
        skipped(Store.track.id);
      }
    }
  }

  timeUpdate = () => {
    // this.progress = this.player.state.progress;
    // this.duration = this.player.state.duration;
    console.log(this.player.currentTime);
    var current_hour = parseInt(this.player.currentTime / 3600) % 24,
        current_minute = parseInt(this.player.currentTime / 60) % 60,
        current_seconds_long = this.player.currentTime % 60,
        current_seconds = current_seconds_long.toFixed(),
        current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);
        
    this.currentTime.innerHTML = current_time

    if (this.player.duration) {
      this.prog.value = (this.player.currentTime / this.player.duration);
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

    return (
      <div className="player-container">
        <audio 
          style={{display: 'none'}}
          ref={player => {this.player = player}}
          src={Store.track.mp3}
          autoPlay={true}
        />
        <div className="controls-container">
          <Ionicon 
            className="clickable svgBtnDefault" 
            color="#66BB6A" 
            icon="ios-skip-backward" 
            fontSize="60px"
            onClick={() => {Store.previous()}}
          />
          <div className={Store.playing ? "hidden play" : "play"}>
            <Ionicon 
              className="clickable svgBtnDefault play-pause play"
              color="#66BB6A" 
              icon="ios-play" 
              fontSize="60px" 
              onClick={() => {this.play()}}
            />
          </div>
          <div className={Store.playing ? "" : "hidden"}>
            <Ionicon 
              className="clickable svgBtnDefault play-pause" 
              color="#66BB6A" 
              icon="ios-pause" 
              fontSize="60px" 
              onClick={() => {this.pause()}}
            />
          </div>
          <Ionicon 
            className="clickable svgBtnDefault" 
            color="#66BB6A" 
            icon="ios-skip-forward" 
            fontSize="60px"
            onClick={() => {Store.next()}}
          />
        </div>
        <progress 
          value="0" 
          max="1"
          className="progress"
          ref={elem => this.prog = elem}
        >
        </progress>
        <div className="progress-container">
          <span ref={elem => this.currentTime = elem}>0:00</span>
          <span ref={elem => this.totalTime = elem}>0:00</span>
        </div>
      </div>
    );
  }
}

export default view(Player1)