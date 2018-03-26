import React, { Component } from 'react';
import Store from './../Store';
import { view } from 'react-easy-state'
import Ionicon from 'react-ionicons';
import {history} from './../History';
import {msToSec} from './../Utils';
import {fetchRandomTrack, show, trackInfo, playsCount} from './../api/phishin';
import {} from './../api/hose';
import Spinner from 'react-spinkit';
import './../css/Radio.css';

class Radio extends Component {
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

  }

  // fetchRandomTrack() {
  //   fetchRandomTrack().then(tracks => {
  //     trackInfo(tracks[Math.floor(Math.random() * tracks.length)].id).then(track => {
  //       Store.playRadio(track.show_id, track);
  //     });
  //   });
  // }

  render() {
    if (!Store.radio) {
      return (
        <div className="radio-container">
          {/* <button onClick={() => {this.fetchRandomTrack()}} className="start">
            Play Radio
          </button> */}
        </div>
      )
    }

    let track = Store.track;
    let show = Store.show;

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
            alt={show.date} src={'/images/' + show.date + '.jpg'}
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
            <div>{show.date}</div>
            <div>{show.venue.name}</div>
            <div>{show.venue.location}</div>
          </div>
      </div>
    );
  }
}

export default view(Radio)