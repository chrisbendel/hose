import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './../../css/SideNav.css'

const items = [
  {
    "id": 0,
    "name": "On This Day",
    "path": "/shows/today"
  },
  {
    "id": 1,
    "name": "Random Show",
    "path": "/show/random"
  },
  {
    "id": 2,
    "name": "Shows",
    "path": "/shows"
  },
  {
    "id": 3,
    "name": "Songs",
    "path": "/song"
  },
  // {
  //   "id": 5,
  //   "name": "Settings",
  //   "path": "/settings"
  // },
  // {
  //   "id": 6,
  //   "name": "Profile",
  //   "path": "/profile"
  // }
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
      <NavLink 
        exact
        key={item.id} 
        id={item.id} 
        to={item.path} 
        activeClassName="active"
      >
        <span>{item.name}</span>
      </NavLink>
    );
  });

  render() {
    return (
      <div className="sidenav">
        <div className="logo-area">
          <span className="logo">
            <img src="https://s3.amazonaws.com/hose/images/hose.svg"/>
          </span>
        </div>
        {this.renderList}
        <a href="https://paypal.me/chrissbendel" target="_blank"> Donate (Coffee!) </a>
        <a href="https://admin.gear.mycelium.com/gateways/3704/orders/new" target="_blank">Donate (Bitcoin)</a>
        <div className="btn-share">
          Share!
        </div>
      </div>
    );
  }
}