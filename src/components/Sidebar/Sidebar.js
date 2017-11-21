import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { push as Menu } from 'react-burger-menu'
import styles from './../../css/Sidebar.css'

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

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false
    };
  }

  // menuState = (state) => {
  //   return !state.isOpen;
  // }

  renderList = items.map(function(item, index) {
    return (
      <Link key={item.id} id={item.id} to={item.path}>
        <span>{item.name}</span>
      </Link>
    );
  });

  render() {
    return (
      <Menu noOverly onStateChange={ this.menuState } isOpen={this.state.menu} width={225} styles={ styles } pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }>
        {this.renderList}
      </Menu>
    );
  }
}