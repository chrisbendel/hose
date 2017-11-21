import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
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
      <NavLink key={item.id} id={item.id} to={item.path} activeClassName="active">
        <span>{item.name}</span>
      </NavLink>
    );
  });

  render() {
    return (
      <Menu 
        noOverlay
        disableOverlayClick
        customBurgerIcon={ false }
        customCrossIcon={ false }
        onStateChange={ this.menuState } 
        isOpen={true} 
        width={125} 
        styles={ styles }
      >
        {this.renderList}
      </Menu>
    );
  }
}