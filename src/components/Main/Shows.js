import React, { Component } from 'react';
import { shows, showsForYear, showsForVenue, showsForTour, showsToday, show } from './../../api/phishin';
import {yearFilters, tourFilters, venueFilters, sortByOptions, showJamcharts} from './../../filterOptions';
import './../../css/Shows.css';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {emitter} from './../../Emitter';
import {history} from './../../History';
import PlayerInfo from './../../PlayerInfo';
import Spinner from 'react-spinkit';
import isElectron from 'is-electron';

const isJamchart = (id) => {
  return (showJamcharts.indexOf(id) !== -1);
}

//TODO create default empty state if no shows found
export default class Shows extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      shows: null,
      allShows: true,
      filterOption: '',
      page: 1,
      loadingShows: false,
      currentFilter: 'All Shows'
    }
    this.handleScroll = this.handleScroll.bind(this);
  }
  
  componentWillMount = () => {
    let type = this.props.match.params.type;
    let id = this.props.match.params.id;
    this.loadRelevantData(type, id);
  }

  componentWillUnmount = () => {
    if (this.refs.shows) {
      this.refs.shows.removeEventListener('scroll', this.handleScroll);
    }
  }

  componentDidUpdate = () => {
    if (this.refs.shows) {
      this.refs.shows.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillReceiveProps(nextProps) {
    let nextType = nextProps.match.params.type;
    let nextId = nextProps.match.params.id;
    this.loadRelevantData(nextType, nextId);
  }

  handleScroll = (e) => {
    let el = this.refs.shows;
    if (el.scrollTop === (el.scrollHeight - el.offsetHeight)) {
      if (!this.state.loadingShows) {
        this.loadMoreShows();
      }
    }
  }

  loadRelevantData = (type = null, id = null) => {
    if (!type) {
      this.fetchAllShows();
    }

    switch(type) {
      case "year": 
        this.fetchShowsForYear(id);
        break;
      case "today":
        this.fetchShowsToday(id);
        break;
      case "venue":
        this.fetchShowsForVenue(id);
        break;
      case "tour":
        this.fetchShowsForTour(id);
        break;
      default:
    }
  }

  renderShows = (shows) => {
    return shows.map(function (show, index) {
      let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let date = new Date(show.date + ' 00:00');
      return (
        <div key={show.id} onClick={() => {history.push('/show/' + show.id)}} className="image-container">
          <div className="show-information-control">
            <div className="show-tags">
              {show.sbd ? <div className="tag">Soundboard</div> : null}
              {show.remastered ? <div className="tag">Remastered</div> : null}
              {isJamchart(show.id) ? <div className="tag">Jamcharts</div> : null}
            </div>
            <img
              src={'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}
              alt={show.id}
              id={show.id}
            />
            <div className="show-information">
              <div className="center-abs">
                <div className="play-button" onClick={(e) => PlayerInfo.updateShowAndPosition(e,show.id)}>
                  <Ionicon 
                    icon="ios-play" 
                    fontSize="35px" 
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
            onClick={() => {history.push('/show/' + show.id)}}
            className="show-date"
          >
            {date.toLocaleDateString('en-US', dateOptions)}
          </span>
          <span className="show-venue"
            
          >
            {show.venue ? 
              <span onClick={() => {history.push('/shows/venue/' + show.venue.id)}}>
                {show.venue.name} {show.venue.location
              }</span>
              :
              <span onClick={() => {history.push('/shows/venue/' + show.venue_id)}}> 
                {show.venue_name} {show.location}  
              </span>
            }
            
            </span>
        </div>
      );
    }, this);
  }

  fetchShowsToday = (custom = null) => {
    let date;
    if (custom) {
      console.log(custom);
      let thing = new Date(custom + ' 00:00');
      console.log(thing);
      let day = thing.getDate().toString();
      let month = (thing.getMonth() + 1).toString();
      date = month + "-" + day;
    } else {
      let today = new Date();
      let day = today.getDate().toString();
      let month = (today.getMonth() + 1).toString();
      date = month + "-" + day;
    }

    showsToday(date).then(data => {
      let shows = this.sortShows('date', 'desc', data);
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  fetchShowsForTour = (tour) => {
    showsForTour(tour).then(data => {
      let shows = this.sortShows('date', 'desc', data);
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  fetchShowsForVenue = (venue) => {
    showsForVenue(venue).then(showIds => {
      let promises = [];
      showIds.forEach(id => {
        promises.push(show(id).then(showInfo => {
          return showInfo;
        }));
      });

      Promise.all(promises).then(data => {
        let shows = this.sortShows('date', 'desc', data);
        this.setState({
          shows: shows,
          allShows: false
        })
      })
    })
  }

  fetchShowsForYear = (year) => {
    showsForYear(year).then(data => {
      let shows = this.sortShows('date', 'desc', data);
      this.setState({
        shows: shows,
        allShows: false
      })
    })
  }

  sortShows = (attr, order, shows) => {
    let sorted;
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

    if (attr === 'jamcharts') {
      sorted = shows.filter(show => {
        return isJamchart(show.id);
      })
    }

    if (attr === 'likes_count') {
      sorted = shows.sort((a, b) => {
        return parseFloat(b.likes_count) - parseFloat(a.likes_count);
      });
    }

    return sorted;
  }

  fetchAllShows = () => {
    shows().then(data => {
      let shows = this.sortShows('date', 'desc', data);
      this.setState({
        shows: shows,
        allShows: true,
        page: 1,
        currentFilter: "All Shows"
      })
    })
  }

  handleChange = (filterOption) => {
    let shows = this.sortShows(filterOption.attr, filterOption.order, this.state.shows);
    this.setState({ filterOption: filterOption, shows: shows });
  }

  loadMoreShows = () => {
    this.setState({
      loadingShows: true
    })
    let page = this.state.page + 1;
    
    shows(page).then(shows => {
      this.setState(previousState => ({
        loadingShows: false,
        page: page,
        shows: [...previousState.shows, ...shows]
      }));
    });
  }

  setCurrentFilter = (title) => {
    this.setState({currentFilter: title});
  }

  render() {
    let shows = this.state.shows;
    
    if (!shows) {
      return (
        <div style={{position:'fixed', top:'50%', left: '50%', transform: 'translate(-50%, 50%)'}} >
          <Spinner fadeIn='none' name='ball-pulse-rise' />
        </div>
      );
    }

    return (
      <div>
        <div className="filters">
        <div className="scroll-top">
          <Ionicon
            className="clickable"
            icon="ios-arrow-up" 
            fontSize="40px"
            onClick={() => {
              //animate this one day
              this.refs.shows.scrollTop = 0;
            }}
          />
        </div>
          <div className="filter-display">
            <span>Displaying: {this.state.currentFilter}</span>
            <Ionicon
            className="clickable"
            icon="md-close-circle" 
            fontSize="20px"
            onClick={() => {
              this.fetchAllShows()
            }}
          />
          </div>

          <Filter
            setTitle={this.setCurrentFilter.bind(this)}
            name={"Years"}
            path={"/shows/year/"}
            placeholder={"Years"}
            options={yearFilters}
          />
          <Filter 
            setTitle={this.setCurrentFilter.bind(this)}
            name={"Tours"}
            path={"/shows/tour/"}
            placeholder={"Tours"}
            options={tourFilters}
          />
          <Filter 
            setTitle={this.setCurrentFilter.bind(this)}
            name={"Venues"}
            path={"/shows/venue/"}
            placeholder={"Venues"}
            options={venueFilters}
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
        </div>
        <div className="shows-container" ref="shows">
          <div className="show-gallery">
            {this.renderShows(shows)}
          </div>
          {this.state.allShows ?
            <div>
              <Ionicon color="#66BB6A" className={this.state.loadingShows ? "" : "hidden"} icon="ios-refresh" fontSize="80px" rotate={true} />
              <Ionicon color="#66BB6A" className={this.state.loadingShows ? "hidden" : ""} icon="ios-more" fontSize="100px" />
            </div>
            :
            null
            }
        </div>
      </div>
    );
  }
}
