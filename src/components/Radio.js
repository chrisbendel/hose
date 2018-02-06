import React, { Component } from 'react';
import Controls from './../Controls';
import {emitter} from './../Emitter';
import Ionicon from 'react-ionicons';
import {history} from './../History';
import {fetchRandomTrack, show} from './../api/phishin';
import './../css/Radio.css';

export default class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: null,
      currentShow: null
    };
  }

  componentWillMount() {
    emitter.addListener('songUpdate', (show, track, position, playing) => {
      this.setState({
        currentShow: show,
        currentTrack: track,
        playingPosition: position,
        playing: playing
      });
    });
  }

  fetchTrack() {
    fetchRandomTrack().then(track => {
      show(track.show_id).then(show => {
        this.setState({
          currentTrack: track,
          currentShow: show
        });
      });
    });
  }

  render() {
    let track = this.state.currentTrack;
    let show = this.state.currentShow;

    if (!track) {
      return (
        <div className="radio-container">
          <button onClick={() => {this.fetchTrack()}} className="start">
            Play Radio
          </button>
        </div>
      )
    }
    console.log(track)
    console.log(show)
    return (
      <div className="radio-container"> 
        <div className="top">
          <Ionicon className="control" icon="ios-thumbs-up" fontSize="50px" />
          <img 
            className="art"
            alt={track.show_date} src={'https://s3.amazonaws.com/hose/images/' + track.show_date + '.jpg'}
            onClick={() => {
              history.push("/show/" + show.id)
            }}
          />
          <Ionicon className="control" icon="ios-thumbs-down" fontSize="50px" />
        </div>
          <div className="show-details">
            <div>{show.date}</div>
            <div>{show.venue.name}</div>
            <div>{show.venue.location}</div>
          </div>    
        
        <div className="track-info">
          <div> text </div>
          <div> text2 </div>
        </div>
        <div className="player">
          <Ionicon className="control" icon="ios-skip-backward" fontSize="50px" />
          <Ionicon className="control" icon="ios-play" fontSize="50px" />
          <Ionicon className="control" icon="ios-skip-forward" fontSize="50px" />
        </div>
      </div>
    );
  }
}