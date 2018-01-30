import React, { Component } from 'react';
import Controls from './../Controls';
import {emitter} from './../Emitter';
import Ionicon from 'react-ionicons';
import {fetchRandomTrack} from './../api/phishin';
import './../css/Radio.css';

export default class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: null,
    };
  }

  componentWillMount() {
    emitter.addListener('songUpdate', (show, track, position, playing) => {
      this.setState({
        playingShow: show,
        currentTrack: track,
        playingPosition: position,
        playing: playing
      });
    });
  }

  fetchTrack() {
    fetchRandomTrack().then(track => {
      this.setState({currentTrack: track})
    });
  }

  render() {
    let track = this.state.currentTrack;

    if (!track) {
      return (
        <div className="radio-container">
          <button onClick={() => {this.fetchTrack()}} className="start">
            Play Radio
          </button>
        </div>
      )
    }

    return (
      <div className="radio-container"> 
        <div className="information">
          <div className="show-overview">
            <img 
              className="art"
              alt={track.show_date} src={'https://s3.amazonaws.com/hose/images/' + track.show_date + '.jpg'}
            />
          </div>
          <div> show info on the right </div>
          <div> blahblah </div>
        </div>

        <div className="player">
          <Ionicon className="control" icon="ios-skip-backward" fontSize="120px" />
          <Ionicon className="control" icon="ios-play" fontSize="120px" />
          <Ionicon className="control" icon="ios-skip-forward" fontSize="120px" />
        </div>
      </div>
    );
  }
}