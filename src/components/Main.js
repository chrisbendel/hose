import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Shows from './Shows';
import './../css/Main.css';

export default class Main extends Component {
  render() {
    return (
      <div className="Main">
        <Route path="/Shows" component={Shows}/>
      </div>
    );
  }
}