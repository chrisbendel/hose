import React, { Component } from 'react';
import { store, view } from 'react-easy-state'
import { NavLink } from 'react-router-dom';
import { history } from './../../History';
import './../../css/SideNav.css'
import Dialog from 'react-dialog';
import 'react-dialog/css/index.css';

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
  {
    "id": 4,
    "name": "Radio",
    "path": "/radio"
  }
]

class SideNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginOpen: false,
    }
  }

  componentWillUpdate() {
    console.log(store.track);
  }

  renderList = items.map(function(item, index) {
    return (
      <NavLink 
        key={item.id}
        id={item.id}
        to={item.path}
        activeClassName="active"
      >
        <span>{item.name}</span>
      </NavLink>
    );
  });

  openLogin = () => {
    this.setState({loginOpen: true});
  }

  closeLogin = () => {
    this.setState({loginOpen: false});
  }

  render() {
    return (
      <div className="sidenav">
        <div className="logo-area" style={{cursor: 'pointer'}} onClick={() => {
          history.push('/shows');
        }}>
          <span className="logo">
            <img alt="logo" src="https://s3.amazonaws.com/hose/images/hose.svg"/>
          </span>
        </div>
        {this.renderList}
        <a className="clickable" onClick={this.openLogin}>Login</a>
        {this.state.loginOpen &&
          <Dialog
            title="Login to hose"
            modal
            onClose={this.closeLogin}
            buttons={[{
              text: 'Close',
              onClick: () => this.closeLogin()
            }]}
          >
            <h1>Dialog Content</h1>
            <p>More Content. Anything goes here</p>
          </Dialog>
        }
        <a href="https://paypal.me/chrissbendel" target="_blank" rel="noopener noreferrer">Donate</a>
        <a href="https://chrissbendel.github.io/hose/" target="_blank" rel="noopener noreferrer">Get the App</a>
      </div>
    );
  }
}

export default SideNav