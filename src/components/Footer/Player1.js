import React, { Component } from 'react';
import { view } from 'react-easy-state';
import Store from './../../Store';
import {listen, completed, likeTrack, dislikeTrack, skipped} from './../../api/hose';
import {history} from './../../History';
import Ionicon from 'react-ionicons';
import moment from 'moment';

const timeFormat = time => {
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = (time % 60).toFixed(0);

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

    this.state = {
      currentTime: null,
      totalTime: null,
      volume: 50
    }

    Store.player = this;
    this.progress = null;
    this.duration = null;
  }

  componentWillMount() {
    let volume = localStorage.getItem('volume');
    if (volume) {
      this.setState({volume: volume});
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.player) {
      localStorage.setItem('volume', nextState.volume);
      this.player.volume = nextState.volume / 100;
    }
  }

  componentDidUpdate() {
    if (this.player) {
      this.player.addEventListener('play', () => {Store.playing = true});
      this.player.addEventListener('pause', () => {Store.playing = false});
      this.player.addEventListener('timeupdate', this.timeUpdate);
      this.player.addEventListener('emptied', this.checkSkipped);
      this.player.addEventListener('ended', this.trackEnded);
      this.player.addEventListener('loadedmetadata', this.trackStarted);
      this.prog.addEventListener('click', (e) => {
        var percent = e.offsetX / this.prog.offsetWidth;
        this.player.currentTime = percent * this.player.duration;
        this.setState({
          currentProgress: percent
        })
      });
    }
  }

  setVol = val => {
    var player = this.player;
    player.volume = val / 100;
  }

  trackEnded = () => {
    completed(Store.track.id).then(res => {
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

  trackStarted = () => {
    listen(Store.track.id).then(track => {
      if (track) {
        this.setState({
          liked: track.like,
          disliked: track.dislike
        });
      }
    });
  }

  timeUpdate = () => {
    this.progress = this.player.currentTime;
    this.duration = this.player.duration;

    this.setState({
      currentTime: this.player.currentTime,
      totalTime: this.player.duration,
      currentProgress: this.player.currentTime / this.player.duration
    })
  }

  play = () => {
    this.player.play()
  }

  pause = () => {
    this.player.pause()
  }

  stopScroll = (target) => {
    this.setState({
      [target]: false
    });
  }

  componentWillUnmount() {
    const venue = this.refs.hoverVenue;
    const date = this.refs.hoverDate;

    venue.removeEventListener('animationend', this.stopScroll);
    date.removeEventListener('animationend', this.stopScroll);
  }

  render() {
    if (!Store.track) {
      return <div> Play a show, song, or start Phish Radio to get started!</div>
    }

    return (
      <div className="player-container">
        <link rel="prefetch" href={Store.nextTrack}/>
        <audio 
          style={{display: 'none'}}
          ref={player => {this.player = player}}
          src={Store.track.mp3}
          autoPlay={true}
        />
        <div className="show-information-player">
          <div className="album-art-container clickable" onClick={() => {history.push('/show/' + Store.show.id)}}>
            <img alt={Store.show.date} src={'https://s3.amazonaws.com/hose/images/' + Store.show.date + '.jpg'}/>
          </div>
          <div className="current-track-information">
            <div className="inline-wrapper">
              <span> {Store.track.title} </span>
            </div>
            <div className="inline-wrapper">
              <span 
                onClick={() => {history.push('/show/' + Store.show.id)}}
                className="clickable"
              > 
                 {moment(Store.show.date).format('LL')}
              </span>
            </div>
            <div className="inline-wrapper">
              <span className="clickable" 
                onClick={() => {history.push('/shows/venue/' + Store.show.venue.id)}}> {Store.show.venue.name}, {Store.show.venue.location} 
              </span>
            </div>
          </div>
        </div>
        <div className="controls-container">
          <Ionicon
            icon={Store.userDislikes.indexOf(Store.track.id) > -1 ? "ios-thumbs-down" : "ios-thumbs-down-outline"}
            font-size="50px"
            color="#4CAF50"
            onClick={() => {
              dislikeTrack(Store.track.id).then(track => {
                Store.updateUserLikes();
              });
            }}
          />
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
          <Ionicon 
            icon={Store.userLikes.indexOf(Store.track.id) > -1 ? "ios-thumbs-up" : "ios-thumbs-up-outline"}
            font-size="50px"
            color="#4CAF50"
            onClick={() => {
              likeTrack(Store.track.id).then(track => {
                if (track) {
                  Store.updateUserLikes();
                }
              });
            }}
          />
        </div>
        <progress 
          value={this.state.currentProgress}
          max="1"
          className="progress"
          ref={elem => this.prog = elem}
        >
        </progress>
        <div className="progress-container">
          <span className="volume-slider-container">
            {this.state.volume === 0 ? 
              <Ionicon 
                icon="ios-volume-mute"
                fontSize="40px"
                color="#4CAF50"
                onClick={() => {
                  this.setState({
                    volume: this.state.prevVolume || 50
                  });
                }}
              />
            :
              <Ionicon 
                icon="ios-volume-up"
                fontSize="40px"
                color="#4CAF50"
                onClick={() => {
                  this.setState({
                    prevVolume: this.state.volume,
                    volume: 0
                  });
                }}
              />
            }
            <div className="volume-slider">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={this.state.volume}
                onChange={e => {
                  this.setState({
                    volume: e.currentTarget.value
                  });
                }}
              />
            </div>
          </span>
          <span>{timeFormat(this.state.currentTime)}</span>
          <span>&nbsp; / {timeFormat(this.state.totalTime)}</span>
        </div>
      </div>
    );
  }
}

export default view(Player1)