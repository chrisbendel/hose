import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './../../css/Shows.css';

export default class Filter extends Component {
  constructor (props) {
    super(props);

    this.state= {
      selectedOption: ''
    }
  }

  handleChange = (selectedOption) => {
    this.props.sort(selectedOption.attr, selectedOption.order);
    this.setState({ selectedOption });
  }

  render() {
    let p = this.props;
    return (
      <div className="search-filter">
        <Select
          name={p.placeholder}
          placeholder={p.placeholder}
          value={this.state.value}
          onChange={this.handleChange}
          options={p.options}
        />
      </div>
    );
  }
}