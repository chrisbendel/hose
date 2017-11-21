import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import history from './../../History';
import SearchBar from 'react-search-bar';
import {search} from './../../api/phishin.js';
import styles from './../../css/Search.css';

export default class GlobalSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      results: {}
    };
  }

  
  
  handleClear = () => {
    this.setState({
      suggestions: [],
      results: {}
    });
  }

  handleChange = (input) => {
    search(input).then(data => {
      this.setState({
        suggestions: Object.keys(data),
        results: data
      });
    })
  }

  handleSelection = (value) => {
    if (value) {
      let data = this.state.results[value];
      console.log(data);
      history.push('/songs');
    }
  }

  handleSearch = (input) => {
    search(input).then(data => {
      this.setState({
        suggestions: Object.keys(data),
        results: data
      });
    })
  }

  suggestionRenderer = (suggestion, searchTerm) => {
    return (
      <span>
        <span>{suggestion}</span>
      </span>
    );
  }

  render () {
    console.log(history);
    return (
      <div className="searchBar"> 
        <SearchBar
          placeholder="Search for a song, show, tour or venue."
          // renderSearchButton
          // renderClearButton
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