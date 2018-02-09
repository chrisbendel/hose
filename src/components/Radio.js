import React, { Component } from 'react';
import Controls from './../Controls';
import {emitter} from './../Emitter';
import Ionicon from 'react-ionicons';
import {history} from './../History';
import {msToSec} from './../Utils';
import {fetchRandomTrack, show, trackInfo} from './../api/phishin';
import Spinner from 'react-spinkit';
import './../css/Radio.css';

export default class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: null,
      currentShow: null,
      radioPlaying: false,
      liked: false,
      disliked: false
    };
  }

  componentWillMount() {
    if (Controls.radioPlaying) {
      this.setState({
        currentShow: Controls.show,
        currentTrack: Controls.track,
        playing: Controls.playing,
        radioPlaying: Controls.radioPlaying
      });
    }

    emitter.addListener('songUpdate', (show, track, position, playing) => {
      this.setState({
        currentShow: show,
        currentTrack: track,
        playing: playing,
        radioPlaying: Controls.radioPlaying
      });
    });
  }

  componentWillUnmount() {
    emitter.removeAllListeners('songUpdate');
  }

  fetchRandomTrack() {
    fetchRandomTrack().then(tracks => {
      trackInfo(tracks[Math.floor(Math.random() * tracks.length)].id).then(track => {
        show(track.show_id).then(show => {
          Controls.updateShowAndPosition(show.id, track.position, true);
        });
      });
    });
  }

  render() {
    let track = this.state.currentTrack;
    let show = this.state.currentShow;

    if (!Controls.radioPlaying) {
      return (
        <div className="radio-container">
          <button onClick={() => {this.fetchRandomTrack()}} className="start">
            Play Radio
          </button>
        </div>
      )
    }

    console.log(track);

    return (
      <div className="radio-container"> 
        <div className="top">
          <Ionicon 
            className="control" 
            icon={this.state.disliked ? "ios-thumbs-down" : "ios-thumbs-down-outline"}
            color={this.state.disliked ? "#4CAF50" : "#000"} 
            fontSize="50px"
            onClick={() => {
              if (this.state.liked) {
                this.setState({disliked: !this.state.disliked, liked: false})
              } else {
                this.setState({disliked: !this.state.disliked})  
              }
            }}
          />
          <img 
            className="art"
            alt={show.date} src={'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}
            onClick={() => {
              history.push("/show/" + show.id)
            }}
          />
          <Ionicon 
            className="control" 
            icon={this.state.liked ? "ios-thumbs-up" : "ios-thumbs-up-outline"}
            color={this.state.liked ? "#4CAF50" : "#000"}
            fontSize="50px"
            onClick={() => {
              if (this.state.disliked) {
                this.setState({liked: !this.state.liked, disliked: false})    
              } else {
                this.setState({liked: !this.state.liked})
              }
            }}
          />
        </div>
          <div className="show-details">
            <div className="song">{track.title}</div>
            <div>
              <Ionicon fontSize="15px" color="red" icon="ios-heart"/>
              <span>{track.likes_count}</span>
            </div>
            <div>{msToSec(track.duration)}</div>
            <div>Total plays (soon)</div>
            <div>{show.date}</div>
            <div>{show.venue.name}</div>
            <div>{show.venue.location}</div>
          </div>
      </div>
    );
  }
}