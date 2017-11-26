import React, { Component } from 'react';
import './../css/Playlist.css';
export default class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: null
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.match.params.id !== this.props.match.params.id) {
    //   this.fetchShow(nextProps.match.params.id);
    // }
  }

  componentWillMount() {
    console.log('hi');
  }

  render() {
    return (
      <div className="playlist-container">
        
      </div>
    );
  }
}