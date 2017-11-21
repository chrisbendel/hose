import React, { Component } from 'react';
import SearchBar from 'react-search-bar';
import {search} from './../../api/phishin.js';
import styles from './../../css/Search.css';

let terms = [];

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
    search(input).then(data => {
      // terms = data;
      // console.log(terms);
      this.setState({
        suggestions: data
      });
      // this.setState({
      //   suggestions: terms.filter(term => term.includes(input))
      // });
    })

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
          placeholder="Search for a song, show or venue."
          delay={200}
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