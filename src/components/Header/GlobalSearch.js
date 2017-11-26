import React, { Component } from 'react';
import {search} from './../../api/phishin.js';
import './../../css/Search.css';
import Autosuggest from 'react-autosuggest';

// let results = {};
let results = [];

String.prototype.fuzzy = function (s) {
  var hay = this.toLowerCase(), i = 0, n = 0, l;
  s = s.toLowerCase();
  for (; l = s[i++] ;) if ((n = hay.indexOf(l, n)) === -1) return false;
  return true;
};

export default class GlobalSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: []
    }; 
  }

  getSuggestions = (value) => {
    return results.filter(function (res) {
      return res.display.fuzzy(value);
    });
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
        suggestions: this.getSuggestions(value)
      });
    })
  };
  
  renderSuggestion = suggestion => {
    console.log(suggestion);
    return (
      <div>
        {suggestion.display}
      </div>
    )
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    if (suggestion) {
      this.props.history.push(suggestion.path);
    }
  }

  getSuggestionValue = (suggestion) => {
    return suggestion.display;
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
      placeholder: "Search for a song, date, tour or venue.",
      value,
      onChange: this.onChange,
      autoFocus: true
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