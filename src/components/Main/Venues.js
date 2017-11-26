import React, { Component } from 'react';
import './../../css/Main.css';

export default class Venues extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount = () => {
    console.log(this.props);
  }

  render() {
    return (
      <div>
        hello
      </div>
    );
  }
}