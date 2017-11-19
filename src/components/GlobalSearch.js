import React, { Component } from 'react';
import SearchInput, {createFilter} from 'react-search-input'

export default class GlobalSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };
  }

  searchUpdated = (q) => {
    this.setState({query: q})
  }

  render () {
    return (
      <div>
        <SearchInput className="search-input" onChange={this.searchUpdated} />
      </div>
    )
  }
}