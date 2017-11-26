import React, { Component } from 'react';
import './../../css/Shows.css';
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
      if (show) {
        this.setState({
          show: show
        })
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchShow(nextProps.match.params.id);
    }
  }

  componentWillMount() {
    this.fetchShow(this.props.match.params.id);
  }

  // Don't think we'll need to default to an image
  // Every show should have a corresponding picture
  // If we run into an error, add onError={() => {this.getDefaultImage()}} to image tag
  // getDefaultImage = () => {
  //   this.setState({
  //     image: process.env.PUBLIC_URL + '/art/default.jpg'
  //   });
  // }

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
          <img 
            className="art" 
            alt={show.date} src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}
          />
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