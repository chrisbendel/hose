import React, { Component } from 'react';
import './../../css/Login.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  login() {

  }

  render() {
    return <div onClick={this.login()}> Login </div>
  }
}