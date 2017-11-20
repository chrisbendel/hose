import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './../../css/Main.css';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: "all"
    }
  }

  componentWillMount = () => {

  }

  render() {
    return (
      <div className="Main">
        
      </div>
    );
  }
}