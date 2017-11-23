import React, { Component } from 'react';
import './../../css/Main.css';
import { withRouter } from 'react-router-dom';
import { show } from './../../api/phishin';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: null
    }
  }

  componentWillMount() {
    show(this.props.match.params.id).then(show => {
      this.setState({
        show: show
      })
    });
  }

  render() {
    let show = this.state.show;
    if (!show) {
      return (
        <div>
          Loading ...
        </div>
      )
    }
    
    console.log(show);
    return (
      <div >
        <div className="show-details">
          {show.date}
        </div>
        <div className="show-list">
          list
        </div>
      </div>
    );
  }
}

export default Main;