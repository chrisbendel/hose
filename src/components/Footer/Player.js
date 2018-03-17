import React, { Component } from 'react';
import { store, view } from 'react-easy-state'
import Store from './../../Store';
import Audio from 'react-audioplayer';
import Ionicon from 'react-ionicons';
import ReactDOM from 'react-dom';
import {getTrack, listen, completed, likeTrack, dislikeTrack} from './../../api/hose';
import {downloadShow, mapTracks} from './../../Utils';
import {history} from './../../History';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import './../../css/Player.css';

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hoverVenue: false,
      hoverDate: false,
      liked: false,
      disliked: false
    }

    Store.player = this;
  }

  componentWillUnmount() {
    const venue = this.refs.hoverVenue;
    const date = this.refs.hoverDate;

    venue.removeEventListener('animationend', this.stopScroll);
    date.removeEventListener('animationend', this.stopScroll);
  }

  // componentWillUpdate() {
  //   if (Store.track) {
  //     getTrack(Store.track.id).then(track => {

  //     });
  //   }
  // }
  
  componentDidUpdate() {
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

    if (this.player) {
      let element = this.player.audioElement;
      
      element.addEventListener('ended', this.trackEnded);
      element.addEventListener('loadedmetadata', this.trackStarted);
      element.addEventListener('playing', this.setControls);
      element.addEventListener('play', this.setControls);
      element.addEventListener('pause', this.setControls);
    }
  }

  trackEnded = () => {
    completed(Store.track.id).then(() => {
      getTrack(Store.track.id).then(track => {
        this.setState({
          liked: track.liked,
          disliked: track.disliked
        });
      });
    });
  }

  trackStarted = () => {
    listen(Store.track.id).then(() => {
      getTrack(Store.track.id).then(track => {
        this.setState({
          liked: track.liked,
          disliked: track.disliked
        });
      });
    });
  }

  setControls = () => {
    if (this.player) {
      let playerState = this.player.state;

      let currentPosition = playerState.currentPlaylistPos + 1;
      let currentTrack = Store.show.tracks.find(track => {
        return track.position === currentPosition;
      });
      
      Store.track = currentTrack;
      Store.playing = playerState.playing;
    }
  }

  play = e => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-play'));
      this.setControls();
    }
  }

  pause = e => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-pause'));
      this.setControls();
    }
  }
  
  skipToNext = e => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-next'));
      this.setControls();
    }
  }

  skipToPrevious = e => {
    if (this.player) {
      ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-previous'));
      this.setControls();
    }
  }

  setPlaylistPosition = index => {
    this.player.state.currentPlaylistPos = index - 1;
    
    this.skipToNext();
    this.skipToPrevious();
  }

  stopScroll = target => {
    this.setState({
      [target]: false
    });
  }

  renderPlaylistContent = set => {
    return Store.show.tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <li
          className="playlist-container-item" 
          key={track.position}
          onClick={() => {
            this.setPlaylistPosition(track.position);
          }}
        >
          <span> {track.position} - </span>
          <span>{track.title}</span>
        </li>
      );
    });
  }

  renderPlaylistContainer = () => {
    const sets = [...new Set(Store.show.tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <div key={set}>
          <p> {set} </p>
          <ul className="playlist-section"> {this.renderPlaylistContent(set)} </ul>
        </div>
      )
    });
  }
  
  render() {
    let show = Store.show;
    
    if (!show) {
      return (<div> Pick a show or song to start listening </div>);
    }

    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(show.date + ' 00:00');

    return (
      <div className="controls-container">
        <div className="show-information-player">
          <div className="album-art-container clickable" onClick={() => {history.push('/show/' + show.id)}}>
            <img alt={show.date} src={'/images/' + show.date + '.jpg'}/>
          </div>
          <div className="current-track-information">
            <div 
              ref='hoverDate'
              className={this.state.hoverDate ? "inline-wrapper hovering" : "inline-wrapper"}
              onMouseEnter = {() => {this.setState({hoverDate: true})}}
            >
              <span 
                onClick={() => {history.push('/show/' + show.id)}}
                className="clickable"
              > 
                {date.toLocaleDateString('en-US', dateOptions)}  
              </span>
              <span 
                onClick={() => {history.push('/show/' + show.id)}}
                className="clickable"
              > 
                {date.toLocaleDateString('en-US', dateOptions)}
              </span>
            </div>
            <div 
              ref='hoverVenue'
              className={this.state.hoverVenue ? "inline-wrapper hovering" : "inline-wrapper"}
              onMouseEnter = {() => {this.setState({hoverVenue: true})}}
            >
              <span className="clickable" 
                onClick={() => {history.push('/shows/venue/' + show.venue.id)}}> {show.venue.name}, {show.venue.location} 
              </span>
              <span className="clickable" 
                onClick={() => {history.push('/shows/venue/' + show.venue.id)}}> {show.venue.name}, {show.venue.location} 
              </span>
            </div>
          </div>
        </div>
        <div className="center-container">
        <Ionicon 
          style={{marginRight: 10}} 
          className="clickable" 
          icon={this.state.disliked ? "ios-thumbs-down" : "ios-thumbs-down-outline"}
          fontSize="40px" 
          onClick={() => {
            dislikeTrack(Store.track.id).then(track => {
              console.log(track);
              this.setState({
                liked: track.liked,
                disliked: track.disliked
              });
            });
          }}
        />
          <Audio
            ref={audioComponent => { this.player = audioComponent }}
            width={500}
            height={50}
            autoPlay={true}
            playlist={mapTracks(show.tracks)}
            color="#000"
          />
        <Ionicon 
          style={{marginLeft: 10}} 
          className="clickable" 
          icon={this.state.liked ? "ios-thumbs-up" : "ios-thumbs-up-outline"}
          fontSize="40px" 
          onClick={() => {
            likeTrack(Store.track.id).then(track => {
              console.log(track);
              this.setState({
                liked: track.liked,
                disliked: track.disliked
              });
            });
          }}
        />
        </div>
        <div className="right-content">
          <Tooltip
            trigger="click"
            interactive
            inertia={true}
            arrow={true}
            animation="scale"
            theme="light"
            arrowSize={"big"}
            duration={200}
            html={<div className="playlist-container">{this.renderPlaylistContainer()}</div>}
          >
            <Ionicon className="clickable right-icon" icon="ios-list-box" fontSize="60px"/>
          </Tooltip>
          <Ionicon className="clickable right-icon" icon="ios-cloud-download" fontSize="60px" onClick={() => window.confirm("Download " + show.date + "?" ) ? downloadShow(Store.show) : null}/>
        </div>
      </div>
    );
  }
}

export default view(Player)