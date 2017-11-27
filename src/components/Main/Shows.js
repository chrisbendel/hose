import React, { Component } from 'react';
import { shows, showsByYear } from './../../api/phishin';
import './../../css/Shows.css';
import Ionicon from 'react-ionicons';

const years = [
  {"year": "All", "short": "All", "era": "All"},
  {"year": "1983-1987", "short": "83-87", "era": "1.0"},
  {"year": "1988", "short": "'88", "era": "1.0"},
  {"year": "1989", "short": "'89", "era": "1.0"},
  {"year": "1990", "short": "'90", "era": "1.0"},
  {"year": "1991", "short": "'91", "era": "1.0"},
  {"year": "1992", "short": "'92", "era": "1.0"},
  {"year": "1993", "short": "'93", "era": "1.0"},
  {"year": "1994", "short": "'94", "era": "1.0"},
  {"year": "1995", "short": "'95", "era": "1.0"},
  {"year": "1996", "short": "'96", "era": "1.0"},
  {"year": "1997", "short": "'97", "era": "1.0"},
  {"year": "1998", "short": "'98", "era": "1.0"},
  {"year": "1999", "short": "'99", "era": "1.0"},
  {"year": "2000", "short": "'00", "era": "1.0"},
  {"year": "2002", "short": "'02", "era": "2.0"},
  {"year": "2003", "short": "'03", "era": "2.0"},
  {"year": "2004", "short": "'04", "era": "2.0"},
  {"year": "2009", "short": "'09", "era": "3.0"},
  {"year": "2010", "short": "'10", "era": "3.0"},
  {"year": "2011", "short": "'11", "era": "3.0"},
  {"year": "2012", "short": "'12", "era": "3.0"},
  {"year": "2013", "short": "'13", "era": "3.0"},
  {"year": "2014", "short": "'14", "era": "3.0"},
  {"year": "2015", "short": "'15", "era": "3.0"},
  {"year": "2016", "short": "'16", "era": "3.0"},
  {"year": "2017", "short": "'17", "era": "3.0"}
]

export default class Shows extends Component {
  constructor(props) {
    super(props);
    
    
    this.state = {
      shows: null
    }
  }

  renderYears = () => {
    return years.map(function(year) {
      if (year.year === "All") {
        return (
          <a onClick={() => {this.fetchShows()}} className="year-list-item" key={year.year}>
            <span>{year.short}</span>
          </a>
        );
      } else {
        return (
          <a onClick={() => {this.fetchShowByYear(year.year)}} className="year-list-item" key={year.year}>
            <span>{year.short}</span>
          </a>
        );
      }
    }, this);
  }

  renderShows = (shows) => {
    return shows.map(function (show) {
      return (
        <div key={show.id} className="image-container" onClick={() => {
          this.props.history.push('show/' + show.id)}
        }>
          <img 
            src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}
            alt={show.id}
            id={show.id}
          />
          <Ionicon 
            icon="ios-play" 
            fontSize="60px" 
            onClick={() => this.props.emitter.emit('playlistUpdate', show.id)} 
            color="red"
          />

          <p> {show.date}  </p>
          <p> {show.venue_name} {show.location} </p>
          <p> Likes: {show.likes_count} </p>

          {show.remastered ? <p> Remastered: yes </p> : null}
          {show.sbd ? <p> Soundboard: yes </p> : null}

        </div>
      );
    }, this);
  }

  fetchShowByYear = (year) => {
    showsByYear(year).then(shows => {
      this.setState({
        shows: shows
      })
    })
  }

  fetchShows = () => {
    shows().then(shows => {
      this.setState({
        shows: shows
      })
    })
  }

  componentWillMount = () => {
    this.fetchShows();
  }

  render() {
    let shows = this.state.shows;
    
    if (!shows) {
      return (
        <div>
          Loading ...
        </div>
      )
    }

    return (
      <div>
        <div className="year-filter">
          <ul className="year-list">
            {this.renderYears()} 
          </ul>
        </div>
        <div className="shows-container">
          <div className="show-gallery">
            {this.renderShows(shows)}
          </div>
        </div>
      </div>
    );
  }
}