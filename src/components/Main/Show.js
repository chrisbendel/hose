import React, { Component } from 'react';
import './../../css/Show.css';
import { show, randomShow } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import ReactTable from 'react-table';

const msToSec = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export default class Show extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: null,
      currentPosition: 0
    }

    this.props.emitter.addListener('newSong', (position) => {
      console.log(position);
      this.setState({currentPosition: position + 1});
    });
  }

  fetchShow = (id) => {
    show(id).then(show => {
      if (show) {
        this.setState({
          show: show
        })
      }
    });
  }

  fetchRandomShow = () => {
    randomShow().then(show => {
      this.setState({
        show: show
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id === 'random') {
      this.fetchRandomShow();
    }
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchShow(nextProps.match.params.id);
    }
  }

  componentWillMount() {
    console.log(this.props);
    if (this.props.match.params.id === 'random') {
      this.fetchRandomShow();
    } else {
      this.fetchShow(this.props.match.params.id);
    }
  }

  renderTracks = (set) => {
    let show = this.state.show;
    let tracks = show.tracks;
    let emitter = this.props.emitter;
    
    return tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <li 
          className="show-container-item" 
          key={track.position}
        >
          <span className="play-cell">
            <span className="play-button-sm">
              <Ionicon 
                style={{cursor: 'pointer'}}
                icon="ios-play"
                font-size="40px"
                onClick={() => {
                  emitter.emit('playlistUpdate', show.id, track.position - 1)
                }}
                className="track-play"
              />
            </span>
            <span className="track-number">{track.position}</span>
          </span>
          <span className="title-cell">{track.title}</span>
          <span className="likes-cell">{track.likes_count}</span>
          <span className="length-cell">{msToSec(track.duration)}</span>
        </li>
      );
    });
  }

  renderTrackContainer = () => {
    const sets = [...new Set(this.state.show.tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <div>
          <ul className="playlist-section"> 
            <h2 className="set-name"> {set} </h2>
            <li 
              className="show-container-item"
            >
              <span className="play-cell">
                #
              </span>
              <span className="title-cell">Title</span>
              <span className="likes-cell">Likes</span>
              <span className="length-cell">Length</span>

            </li>
            {this.renderTracks(set)} 
          </ul>
        </div>
      )
    });
  }

  render() {
    if (!this.state.show) {
      return (
        <div>
          Loading ...
        </div>
      )
    }

    let show = this.state.show;
    let tracks = show.tracks;

    console.log(show);

    return (
      <div className="show-container">
        <div className="show-overview">
          <img 
            className="art"
            alt={show.date} src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}
          />
          <div className="show-details">
            <p> {show.date} </p>
            <p> {show.venue.name} </p>
            <p> {show.venue.location} </p>

            <p> {show.date} </p>
            <p> {show.tags} </p>
            <p> {show.remastered ? "Remastered" : null} </p>
            <p> {show.sbd ? "Soundboard" : null} </p>
            <p> Tour : {show.tour} (we can fetch this tour and show information about the tour, possibly using a component) this will link to the tour page with all the shows from that tour</p>
            
          </div>
        </div>
        <div className="show-tracks">
          {this.renderTrackContainer()}
        </div>
      </div>
    );
  }
}