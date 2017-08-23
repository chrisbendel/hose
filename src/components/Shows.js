import React, { Component } from 'react';
import {shows} from './../api/phishin.js';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

export default class Shows extends Component {
  state = {
    shows: null
  }

  componentWillMount() {
    shows().then(shows => {
      this.setState({shows: shows});
    })
  }

  render() {
    let shows = this.state.shows;
    if (!shows) {
      return (
        <div> Loading ... </div>
      );
    } else {
      return (
        <ReactTable
        data={shows}
        columns={columns}
      />
      )
    }
  }
}

const columns = [
  {Header: 'Date', accessor: 'date'},
  {Header: 'Venue', accessor: 'venue_name'},
  {Header: 'Location', accessor: 'location'}
]
