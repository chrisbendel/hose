import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Shows from './Shows';
import GlobalSearch from './GlobalSearch';
import Years from './Years';
import './../css/Main.css';

export default class Main extends Component {
  render() {
    return (
      <div id="page-wrap"className="Main">
        <GlobalSearch />
        <div className="Content">
          <Route path="/shows" component={Shows}/>
          <Route path="/years" component={Years}/>
        </div>
        <div className="Player">
          Player
        </div>
      </div>
    );
  }
}