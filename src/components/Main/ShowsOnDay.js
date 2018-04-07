import React, { Component } from 'react';
import { view } from 'react-easy-state'
import ShowList from './../Main/ShowList';
import { showsToday } from './../../api/phishin';

class ShowsOnDay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shows: [],
      date: null
    }
  }

  componentWillMount = () => {
    let date = this.props.match.params.date;
    this.fetchShowsToday(date);
  }

  fetchShowsToday = (custom = null) => {
    let today;

    if (custom) {
      today = new Date(custom + ' 00:00');
    } else {
      today = new Date();
    }

    let day = today.getDate().toString();
    let month = (today.getMonth() + 1).toString();
    let date = month + "-" + day;

    showsToday(date).then(shows => {
      let ordered = shows.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      this.setState({
        shows: ordered,
        date: today.toLocaleString('en-us', {month: 'long', day: "numeric"})
      });
    });
  }

  render() {
    const {shows, date} = this.state;
    return (
      <div style={{padding: "2rem"}}>
        <h2>Shows on {date}</h2>
        <ShowList shows={shows}/>
      </div>
    );
  }
}

export default view(ShowsOnDay)