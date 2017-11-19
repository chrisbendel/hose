import React, { Component } from 'react';
import SearchInput from 'react-search-input'
import {search} from './../api/phishin.js';

export default class GlobalSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };
  }

  searchUpdated = (q) => {
    this.setState({query: q});    
    if (!q) {
      return;
    }
    search(q).then(res => {
      console.log(res);
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      alert('hi');
    }
  }

  render () {
    return (
      <div>
        <SearchInput onKeyPress={this.handleKeyPress} className="search-input" onChange={this.searchUpdated} />
      </div>
    )
  }
}