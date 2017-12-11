import React, { Component } from 'react';
import './../../css/Login.css';
import {login} from './../../api/phishin';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div onClick={() => login()}> login </div>
  }
}