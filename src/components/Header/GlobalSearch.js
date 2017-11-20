import React, { Component } from 'react';
import SearchBar from 'react-search-bar';
import {search} from './../../api/phishin.js';
import styles from './../../css/Search.css';
const words = [];

export default class GlobalSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: []
    };
  }
  
  handleClear = () => {
    this.setState({
      suggestions: []
    });
  }

  handleChange = (input) => {
    this.setState({
      suggestions: words.filter(word => word.includes(input))
    });
  }

  handleSelection = (value) => {
    if (value) {
      console.info(`Selected "${value}"`);
    }
  }

  handleSearch = (value) => {
    if (value) {
      console.info(`Searching "${value}"`);
    }
  }

  suggestionRenderer = (suggestion, searchTerm) => {
    return (
      <span>
        <span>{searchTerm}</span>
        <strong>{suggestion.substr(searchTerm.length)}</strong>
      </span>
    );
  }

  render () {
    return (
      <div>
        <SearchBar
          autoFocus
          renderClearButton
          renderSearchButton
          placeholder="Search for a song, show or venue."
          onChange={this.handleChange}
          onClear={this.handleClear}
          onSelection={this.handleSelection}
          onSearch={this.handleSearch}
          suggestions={this.state.suggestions}
          suggestionRenderer={this.suggestionRenderer}
          styles={styles}
        />
      </div>
    )
  }
}