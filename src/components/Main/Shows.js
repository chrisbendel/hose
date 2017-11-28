import React, { Component } from 'react';
import { shows, showsForYear, showsForVenue, showsToday } from './../../api/phishin';
import ReactDOM from 'react-dom';
import './../../css/Shows.css';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

//TODO create default empty state if no shows found
export default class Shows extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      shows: null,
      path: 'shows',
      filterOption: ''
    }
  }

  componentWillMount = () => {
    console.log(this.props.match.params);
    let type = this.props.match.params.type;
    let id = this.props.match.params.id;
    
    this.loadRelevantData(type, id);
  }

  componentWillReceiveProps(nextProps) {
    let currentType = this.props.match.params.type;
    let currentId = this.props.match.params.id;

    let nextType = nextProps.match.params.type;
    let nextId = nextProps.match.params.id;

    if (!((nextType === currentType) && (nextId === currentId))) {
      this.loadRelevantData(nextType, nextId);
    } else {
      console.log('the same');
    }
  }

  loadRelevantData = (type, id = null) => {
    switch(type) {
      case "year": 
        this.fetchShowsForYear(id);
        break;
      case "today":
        this.fetchShowsToday();
        break;
      case "venue":
        this.fetchShowsForVenue(id);
      default:
        this.fetchAllShows();
    }

  }

  renderYears = () => {
    return years.map(function(year) {
      if (year.year === "All") {
        return (
          <a onClick={() => {
            this.props.history.push('/shows' + year.path);
              // this.fetchShows()
            }} 
            className="year-list-item" 
            key={year.year}
          >
            <span>{year.short}</span>
          </a>
        );
      } else {
        return (
          <a onClick={() => {
            this.props.history.push('/shows/year/' + year.year);
              // this.fetchShowByYear(year.year)
            }}
            className="year-list-item" 
            key={year.year}
          >
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
          <div className="show-information-control">
            <img 
              src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}
              alt={show.id}
              id={show.id}
            />
            <div className="show-information">
              <Ionicon 
                icon="ios-play" 
                fontSize="60px" 
                onClick={() => this.props.emitter.emit('playlistUpdate', show.id)}
                color="white"
                className="center-abs"
              />
            </div>
          </div>
          <p> {show.date}  </p>
          <p> {show.venue_name} {show.location} </p>
          <p> Likes: {show.likes_count} </p>

          {show.remastered ? <p> Remastered: yes </p> : null}
          {show.sbd ? <p> Soundboard: yes </p> : null}

        </div>
      );
    }, this);
  }

  fetchShowsToday = () => {
    let today = new Date();
    let day = today.getDate().toString();
    let month = (today.getMonth() + 1).toString();
    let date = month + "-" + day;
    showsToday(date).then(shows => {
      this.setState({
        shows: shows,
        path: 'shows-on-day-of-year/' + date
      })
    })
  }

  fetchShowsForVenue = (venue) => {
    showsForVenue(venue).then(showIds => {
      //TODO fetch all the shows from the show ids passed in from response
      this.setState({
        shows: shows,
        path: 'venues/' + venue
      })
    })
  }

  fetchShowsForYear = (year) => {
    showsForYear(year).then(shows => {
      this.setState({
        shows: shows,
        path: 'year/' + year
      })
    })
  }

  sortShows = (attr, order) => {
    console.log(attr, order);
    let sorted;
    let shows = this.state.shows;
    if (attr === 'date') {
      sorted = shows.sort((a, b) => {
        var c = new Date(a.date);
        var d = new Date(b.date);
        if (order === 'asc') {
          return c-d;
        } else if (order === 'desc') {
          return d-c;
        }
      });
    }

    if (attr === 'likes_count') {
      sorted = shows.sort((a, b) => {
        return parseFloat(b.likes_count) - parseFloat(a.likes_count);
      });
    }

    this.setState({
      shows: sorted
    })
  }

  fetchAllShows = () => {
    shows().then(shows => {
      this.setState({
        shows: shows,
        path: 'shows'
      })
    })
  }

  handleChange = (filterOption) => {
    this.sortShows(filterOption.attr, filterOption.order);
    this.setState({ filterOption: filterOption });
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
        <div className="filters">
          <Ionicon 
            className="clickable" 
            icon="ios-arrow-dropup-circle" 
            fontSize="60px"
            onClick={() => {this.refs.shows.scroll({top: 0, behavior:"smooth"})}}
          />
          <div className="search-filter">
            <Select
              name={"Sort by"}
              placeholder={"Sort by"}
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
              options={sortByOptions}
            />
          </div>
          <Filter
            placeholder={"Sort by..."}
            options={sortByOptions}
            sort={this.sortShows.bind(this)}
          />
          <Filter />
          <Filter />
        </div>
        <div className="shows-container" ref="shows">
          <div className="show-gallery">
            {this.renderShows(shows)}
          </div>
        </div>
      </div>
    );
  }
}

const sortByOptions = [
  {label: 'Popular', value: "popular", attr: "likes_count", order: "desc"},
  {label: 'Date (Recent)', value: "recent", attr: "date", order: "desc"},
  {label: 'Date (Older)', value: "older", attr: "date", order: "asc"},
];

const years = [
  {"year": "All Shows", "short": "All", "era": "All"},
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
];