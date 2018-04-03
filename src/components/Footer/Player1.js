import React, { Component } from 'react';
import { store, view } from 'react-easy-state';
import Store from './../../Store';
import {getTrack, listen, completed, likeTrack, dislikeTrack, skipped} from './../../api/hose';
import {history} from './../../History';
import Ionicon from 'react-ionicons';

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
      totalTime: null
    }

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
        this.setState({
          currentProgress: percent
        })
      });
    }

    if (this.refs.hoverVenue && this.refs.hoverDate) {
      const venue = this.refs.hoverVenue;
      const date = this.refs.hoverDate;
  
      venue.addEventListener('animationend', () => {
        this.stopScroll('hoverVenue');
      });

      date.addEventListener('animationend', () => {
        this.stopScroll('hoverDate');
      });
    }
  }

  setVol = val => {
    var player = this.player;
    player.volume = val / 100;
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
      return (
        <div> Help text to show the user what to do. 
          Possibly: Start playing a random show(button), start playing radio(button),
          or just tell them to play something themselves 
        </div>
      );
    }
    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(Store.show.date + ' 00:00');

    return (
      <div className="player-container">
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
            <div 
              ref='hoverDate'
              className={this.state.hoverDate ? "inline-wrapper hovering" : "inline-wrapper"}
              onMouseEnter = {() => {this.setState({hoverDate: true})}}
            >
              <span 
                onClick={() => {history.push('/show/' + Store.show.id)}}
                className="clickable"
              > 
                {Store.track.title}&nbsp;&bull;&nbsp;{date.toLocaleDateString('en-US', dateOptions)}  
              </span>
              <span 
                onClick={() => {history.push('/show/' + Store.show.id)}}
                className="clickable"
              > 
                {date.toLocaleDateString('en-US', dateOptions)}  
              </span>
            </div>
            <div 
              ref='hoverVenue'
              className={this.state.hoverDate ? "inline-wrapper hovering" : "inline-wrapper"}
              onMouseEnter = {() => {this.setState({hoverVenue: true})}}
            >
              <span className="clickable" 
                onClick={() => {history.push('/shows/venue/' + Store.show.venue.id)}}> {Store.show.venue.name}, {Store.show.venue.location} 
              </span>
              <span className="clickable" 
                onClick={() => {history.push('/shows/venue/' + Store.show.venue.id)}}> {Store.show.venue.name}, {Store.show.venue.location} 
              </span>
            </div>
          </div>
        </div>
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
          value={this.state.currentProgress}
          max="1"
          className="progress"
          ref={elem => this.prog = elem}
        >
        </progress>
        <div className="progress-container">
          <span className="volume-slider-container">
            <div className="volume-slider">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                onChange={e => {
                  this.setVol(e.currentTarget.value);
                }}
              />
            </div>
          </span>
          <span ref={elem => this.currentTime = elem}>{timeFormat(this.state.currentTime)}</span>
          <span ref={elem => this.totalTime = elem}>&nbsp; / {timeFormat(this.state.totalTime)}</span>
          <span className="like-cell">
            {Store.userLikes.indexOf(Store.track.id) > -1 ?
              <Ionicon 
                icon="ios-thumbs-up"
                font-size="40px"
                color="#4CAF50"
                onClick={() => {
                  dislikeTrack(Store.track.id).then(() => {
                    Store.updateUserLikes();
                  });
                }}
              />
            :
              <Ionicon 
                icon="ios-thumbs-up-outline"
                font-size="40px"
                color="#4CAF50"
                onClick={() => {
                  likeTrack(Store.track.id).then(() => {
                    Store.updateUserLikes();
                  });
                }}
              />
            }
          </span>
          <span>
            <Ionicon 
              icon="ios-share-outline"
              font-size="40px"
              color="#333"
              onClick={() => {
                dislikeTrack(Store.track.id).then(() => {
                  Store.updateUserLikes();
                });
              }}
            />
          </span>
        </div>
      </div>
    );
  }
}

export default view(Player1)