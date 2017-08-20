import React, { Component } from 'react';
import {shows} from './../phishin.js';

export default class Shows extends Component {
  state = {
    shows: null
  }

  componentWillMount() {
    shows().then(shows => {
      console.log(shows);
      this.setState({shows: shows});
    })
  }

  render() {
    let shows = this.state.shows;
    if (shows) {
      const show = shows.map(show => {
        return (
          <p key={show.id}> {show.id} </p>
        );
      });
      return (
        <div>
          {show}
        </div>
      )
    } else {
      return (
        <p> Loading ... </p>
      );
    }
  }
}