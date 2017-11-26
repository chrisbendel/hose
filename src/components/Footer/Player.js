import React, { Component } from 'react';
import './../../css/Player.css'
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: null,
      show: null
    }
  }
  componentWillMount() {
    show(665).then(show => {
      console.log(show);
      let tracks = [];
      show.tracks.forEach(function (track) {
        tracks.push({name: track.title, src: track.mp3});
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
          width={600}
          height={100}
          autoPlay={true}
          playlist={this.state.tracks}
        />
      </div>
    );
  }
}