import React, { Component } from 'react';
import history from './../../History';
import {search} from './../../api/phishin.js';
import './../../css/Search.css';
import Autosuggest from 'react-autosuggest';

let results = {}

export default class GlobalSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    search(value).then(data => {
      results = data;
      this.setState({
        suggestions: Object.keys(data)
      });
    })
  };
  
  renderSuggestion = suggestion => {
    return (
      <div>
        {suggestion}
      </div>
    )
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    if (suggestion) {
      let data = results[suggestion];
      console.log(data);
      history.push('/main/' + data.id);
    }
  }

  getSuggestionValue = (suggestion) => {
    return suggestion;
  }

  shouldRenderSuggestions = (value) => {
    return value.trim().length > 2;
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render () {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Search for a song, show, tour or venue.",
      value,
      onChange: this.onChange
    };

    return (
      <div>
        <Autosuggest
          highlightFirstSuggestion={true}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
      </div>
    )
  }
}