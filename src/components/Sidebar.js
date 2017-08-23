import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './../css/Main.css';

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
  },
  {
    "id": 4,
    "name": "Years",
    "path": "/years"
  }
]

const renderList = items.map(function(item, index) {
  return (
    <li key={item.id}>
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