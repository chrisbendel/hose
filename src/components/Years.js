import React, { Component } from 'react';
import {years} from './../api/phishin.js';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

export default class Years extends Component {
  state = {
    years: null
  }

  componentWillMount() {
    years().then(years => {
      years = years.map(function (year) {
        return {
          year: year
        }
      });
      this.setState({years: years});
    })
  }

  render() {
    let years = this.state.years;
    if (!years) {
      return (
        <div> Loading ... </div>
      );
    } else {
      return (
        <ReactTable
          data={years}
          columns={columns}
        />
      );
    }
  }
}

const columns = [
  {Header: 'Year', accessor: 'year'}
]

