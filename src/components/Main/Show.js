import React, { Component } from 'react';
import './../../css/Shows.css';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons';

export default class Show extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: null
    }
  }

  fetchShow(id) {
    show(id).then(show => {
      if (show) {
        this.setState({
          show: show
        })
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchShow(nextProps.match.params.id);
    }
  }

  componentWillMount() {
    this.fetchShow(this.props.match.params.id);
  }

  renderSongs = () => {
    let show = this.state.show;
    let tracks = show.tracks;
    let emitter = this.props.emitter;
    return tracks.map(function (track, index) {
      return (
        <div key={track.id}> 
          <Ionicon 
            style={{cursor: 'pointer'}}
            icon="ios-play"
            font-size="60px"
            onClick={() => {
              emitter.emit('playlistUpdate', show.id, index)
            }}
          />
          {track.title}
        </div>

      )
    });
  }

  render() {
    let show = this.state.show;

    if (!show) {
      return (
        <div>
          Loading ...
        </div>
      )
    }

    console.log(show);

    return (
      <div>
        <div className="show-overview">
          <img 
            className="art"
            alt={show.date} src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}
          />
          <div className="show-details">
            <p>JONAH: make this section fixed and the songs below scrollable</p>
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
        <div className="show-list">
          <ul>
            {this.renderSongs()}
          </ul>
        </div>
      </div>
    );
  }
}