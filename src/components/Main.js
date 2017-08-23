import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Shows from './Shows';
import Years from './Years';
import './../css/Main.css';

export default class Main extends Component {
  render() {
    return (
      <div className="Main">
        <div className="Player">
          Player
        </div>
        <div className="Content">
          <Route path="/shows" component={Shows}/>
          <Route path="/years" component={Years}/>
        </div>
      </div>
    );
  }
}