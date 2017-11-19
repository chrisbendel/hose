import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { push as Menu } from 'react-burger-menu'

var styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '40px',
    height: '30px',
    left: '25px',
    top: '25px'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.2)'
  }
}

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

  menuState = (state) => {
    return !state.isOpen;
  }

  renderList = items.map(function(item, index) {
    return (
      <Link to={item.path}>
        <a key={item.id} id={item.id}>
          <span>{item.name}</span>
        </a>
      </Link>
    );
  });

  render() {
    return (
      <Menu onStateChange={ this.menuState } isOpen={this.state.menu} width={100} styles={ styles } pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }>
        {this.renderList}
      </Menu>
    );
  }
}