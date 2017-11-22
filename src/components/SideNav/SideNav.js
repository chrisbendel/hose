import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './../../css/SideNav.css'

const items = [
  {
    "id": 0,
    "name": "Years",
    "path": "/years"
  },
  {
    "id": 1,
    "name": "Shows",
    "path": "/shows"
  },
  {
    "id": 2,
    "name": "Songs",
    "path": "/songs"
  },
  {
    "id": 3,
    "name": "Venues",
    "path": "/venues"
  }
]

export default class SideNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    };
  }

  renderList = items.map(function(item, index) {
    return (
      <NavLink key={item.id} id={item.id} to={item.path} activeClassName="active">
        <span>{item.name}</span>
      </NavLink>
    );
  });

  render() {
    return (
      <div>
        {this.renderList}
      </div>
    );
  }
}