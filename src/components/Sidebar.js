import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './../css/Sidebar.css';

const items = [
  {
    "name": "Shows",
    "path": "/shows"
  },
  {
    "name": "Songs",
    "path": "/songs"
  },
  {
    "name": "Venues",
    "path": "/venues"
  },
  {
    "name": "Years",
    "path": "/years"
  }
]

const renderList = items.map(function(item, index) {
  return (
    <li>
      <Link to={item.path} className="navItem">
        {item.name}
      </Link>
    </li>
  );
});

export default class Sidebar extends Component {
  render() {
    return (
      <nav className="navContainer">
        <ul className="navList">
          {renderList}
        </ul>
      </nav>
    );
  }
}