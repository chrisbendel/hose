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
      allShows: true,
      filterOption: '',
      page: 1,
      loadingShows: false
    }
  }
  
  componentWillMount = () => {
    let type = this.props.match.params.type;
    let id = this.props.match.params.id;
    this.loadRelevantData(type, id);
  }

  componentWillReceiveProps(nextProps) {
    let nextType = nextProps.match.params.type;
    let nextId = nextProps.match.params.id;
    this.loadRelevantData(nextType, nextId);
  }

  loadRelevantData = (type = null, id = null) => {
    if (!type) {
      this.fetchAllShows();
    }

    switch(type) {
      case "years": 
        this.fetchShowsForYear(id);
        break;
      case "today":
        this.fetchShowsToday();
        break;
      case "venue":
        this.fetchShowsForVenue(id);
    }
  }

  renderShows = (shows) => {
    return shows.map(function (show, index) {
      let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      
      let date = new Date(show.date + ' 00:00');
      return (
        <div key={show.id} className="image-container">
          <div className="show-information-control">
            {show.sbd ? <div className="is-soundboard">Soundboard</div> : null}
            <img 
              src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}
              alt={show.id}
              id={show.id}
            />
            <div className="show-information">
              <div className="center-abs">
                <div className="play-button">
                  <Ionicon 
                    icon="ios-play" 
                    fontSize="35px" 
                    onClick={() => this.props.emitter.emit('playlistUpdate', show.id)}
                    color="white"
                    className="left-10"
                  />
                </div>
                <div className="show-likes">
                  <Ionicon 
                    icon="ios-thumbs-up" 
                    fontSize="18px" 
                    onClick={() => console.log('like clicked')}
                    color="white"
                  />
                  <span className="likes-num"> 
                    {show.likes_count} 
                  </span>
                </div>
              </div>
            </div>
          </div>
          <span 
            onClick={() => {
              this.props.history.push('show/' + show.id)}
            }
            className="show-date"
          >
            {date.toLocaleDateString('en-US', dateOptions)}
          </span>
          <span className="show-venue"> {show.venue_name} {show.location} </span>

          {show.remastered ? <p> Remastered: yes </p> : null}
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
        allShows: false
      })
    })
  }

  fetchShowsForVenue = (venue) => {
    showsForVenue(venue).then(showIds => {
      //TODO fetch all the shows from the show ids passed in from response
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  fetchShowsForYear = (year) => {
    showsForYear(year).then(shows => {
      console.log(shows);
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  sortShows = (attr, order) => {
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
        allShows: true,
        page: 1
      })
    })
  }

  handleChange = (filterOption) => {
    this.sortShows(filterOption.attr, filterOption.order);
    this.setState({ filterOption: filterOption });
  }

  loadMoreShows = () => {
    this.setState({
      loadingShows: true
    })
    let page = this.state.page + 1;
    
    shows(page).then(shows => {
      console.log(shows);
      this.setState(previousState => ({
        loadingShows: false,
        page: page,
        shows: [...previousState.shows, ...shows]
      }));
    });
  }

  render() {
    let shows = this.state.shows;
    
    if (!shows) {
      return (<div> Loading ... </div>);
    }

    return (
      <div>
        <div className="filters">
          <Ionicon 
            className="clickable" 
            icon="ios-arrow-dropup-circle" 
            fontSize="60px"
            onClick={() => {console.log(this.refs.shows); this.refs.shows.scroll({top: 0, behavior:"smooth"})}}
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
            history={this.props.history}
            name={"Years"}
            path={"/shows/years/"}
            placeholder={"Years"}
            options={yearFilters}
            getShows={this.fetchShowsForYear.bind(this)}
          />
          <Filter />
          <Filter />
        </div>
        <div className="shows-container" ref="shows">
          <div className="show-gallery">
            {this.renderShows(shows)}
          </div>
          {this.state.allShows ?
            <div>
              <Ionicon className={this.state.loadingShows ? "" : "hidden"} icon="ios-refresh" fontSize="80px" rotate={true} />
              <div className={this.state.loadingShows ? "hidden" : "load-more"} onClick={() => {
                  this.loadMoreShows();
                }}
              >
                Load more shows 
              </div>
            </div>
            :
            null
            }
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

const yearFilters = [
  {label: "All Shows", value: "all"},
  {label: "1983-1987", value: "1983-1987"},
  {label: "1988", value: "1988"},
  {label: "1989", value: "1989"},
  {label: "1990", value: "1990"},
  {label: "1991", value: "1991"},
  {label: "1992", value: "1992"},
  {label: "1993", value: "1993"},
  {label: "1994", value: "1994"},
  {label: "1995", value: "1995"},
  {label: "1996", value: "1996"},
  {label: "1997", value: "1997"},
  {label: "1998", value: "1998"},
  {label: "1999", value: "1999"},
  {label: "2000", value: "2000"},
  {label: "2002", value: "2002"},
  {label: "2003", value: "2003"},
  {label: "2004", value: "2004"},
  {label: "2009", value: "2009"},
  {label: "2010", value: "2010"},
  {label: "2011", value: "2011"},
  {label: "2012", value: "2012"},
  {label: "2013", value: "2013"},
  {label: "2014", value: "2014"},
  {label: "2015", value: "2015"},
  {label: "2016", value: "2016"},
  {label: "2017", value: "2017"}
];