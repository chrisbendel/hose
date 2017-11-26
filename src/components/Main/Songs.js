import React, { Component } from 'react';
import './../../css/Main.css';
import { withRouter } from 'react-router-dom';

class Main extends Component {
  constructor(props) {
    super(props);
    console.log('hi');
  }

  componentWillMount = () => {
    console.log(this.props);
  }

  render() {
    return (
      <div>
        hello
      </div>
    );
  }
}

export default Main;