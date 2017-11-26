import React, { Component } from 'react';
import './../../css/Shows.css';
import { withRouter } from 'react-router-dom';
import { show } from './../../api/phishin';

export default class Show extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: null
    }
  }

  fetchShow(id) {
    show(id).then(show => {
      this.setState({
        show: show,
        image: process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id != this.props.match.params.id) {
      this.fetchShow(nextProps.match.params.id);
    }
  }

  componentWillMount() {
    this.fetchShow(this.props.match.params.id);
  }

  getDefaultImage = () => {
    this.setState({
      image: process.env.PUBLIC_URL + '/art/default.jpg'
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

    return (
      <div>
        <div className="show-overview">
          <img onError={this.getDefaultImage} className="art" alt={show.date} src={this.state.image}/>
          <div className="show-details">
            <p> test </p>
            <p> test1234234 </p>
          </div>
        </div>
        <div className="show-list">
            list
        </div>
      </div>
    );
  }
}