import React, { Component } from 'react';
import './../../css/Player.css'
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons'

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: null,
      show: null,
      height: 0
    }
  }

  playerDetails = () => {
    
  }

  componentWillMount() {
    show(665).then(show => {
      console.log(show);
      let tracks = [];
      show.tracks.forEach(function (track) {
        tracks.push({name: track.title, src: track.mp3, img: process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'});
      })

      this.setState({
        tracks: tracks,
        show: show
      })
    })
  }

  render() {
    if (!this.state.tracks) {
      return (<div> loading </div>);
    }

    return (
      <div className="controls-container">
        <Audio
          // fullPlayer={true}
          width={600}
          height={100}
          autoPlay={false}
          playlist={this.state.tracks}
        />
        <Ionicon icon="ios-list" 
          fontSize="60px"
          onClick={() => {
            this.playerDetails();
          }}
        />
      </div>
    );
  }
}