import React, { Component } from 'react';
import { view } from 'react-easy-state'
import ShowList from './ShowList';
import './../../css/Shows.css';
import { shows, showsForYear, showsForVenue, showsForTour, show } from './../../api/phishin';
import {yearFilters, tourFilters, venueFilters, sortByOptions} from './../../filters';
import {isShowJamchart, isShowSoundboard} from './../../Utils';
import Ionicon from 'react-ionicons';
import Filter from './Filter';
import Spinner from 'react-spinkit';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class Shows extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      shows: null,
      filterOption: '',
      page: 1,
      loadMoreShows: true,
      loadingShows: false,
      currentFilter: 'All Shows'
    }
  }
  
  componentWillMount = () => {
    let type = this.props.match.params.type;
    let id = this.props.match.params.id;
    this.loadRelevantData(type, id);
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

  handleScroll = e => {
    let el = this.refs.shows;
    
    if (el.scrollTop > (el.scrollHeight - el.offsetHeight - 50)) {
      if (!this.state.loadingShows && this.state.loadMoreShows) {
        this.loadMoreShows();
      }
    }
  }

  loadRelevantData = async (type = null, id = null) => {
    if (!type) {
      this.fetchAllShows();
    }

    switch(type) {
      case "year": 
        this.fetchShowsForYear(id);
        break;
      case "venue":
        this.fetchShowsForVenue(id);
        break;
      case "tour":
        this.fetchShowsForTour(id);
        break;
      default:
        break;
    }
  }

  fetchShowsForTour = (tour) => {
    showsForTour(tour).then(data => {
      let shows = this.sortShows('date', 'desc', data.shows);
      this.setState({
        shows: shows,
        loadMoreShows: false,
        currentFilter: data.name
      });
    });
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
          loadMoreShows: false,
          currentFilter: data[0].venue.name + ', ' + data[0].venue.location
        });
      });
    });
  }

  fetchShowsForYear = (year) => {
    showsForYear(year).then(data => {
      let shows = this.sortShows('date', 'desc', data);
      this.setState({
        shows: shows,
        loadMoreShows: false,
        currentFilter: year
      });
    });
  }

  sortShows = (attr, order, shows) => {
    let sorted;

    if (attr === 'date') {
      sorted = shows.sort((a, b) => {
        var c = new Date(a.date);
        var d = new Date(b.date);
        if (order === 'asc') {
          return c-d;
        } else {
          return d-c;
        }
      });
    }

    if (attr === 'jamcharts') {
      sorted = shows.filter(show => {
        return isShowJamchart(show.id);
      });
    }

    if (attr === 'soundboard') {
      sorted = shows.filter(show => {
        return isShowSoundboard(show.id);
      });
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
        page: 1,
        loadMoreShows: true,
        currentFilter: "All Shows"
      });
    });
  }

  handleChange = (filterOption) => {
    let shows = this.sortShows(filterOption.attr, filterOption.order, this.state.shows);
    this.setState({ filterOption: filterOption, shows: shows, loadMoreShows: false });
  }

  loadMoreShows = () => {
    this.setState({
      loadingShows: true
    });
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
    this.refs.shows.scrollTop = 0;
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
          <div className="scroll-top" onClick={() => {
                this.refs.shows.scrollTop = 0;
              }}>
            <Ionicon icon="ios-arrow-up" fontSize="40px"/>
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
          <div className="filter-display">
            <span>
              {this.state.currentFilter}
              <Ionicon
              className="clickable"
              icon="md-close-circle" 
              fontSize="15px"
              onClick={() => {
                this.fetchAllShows()
              }}
              />
            </span>
          </div>
          <ShowList shows={shows}/>
          {this.state.loadMoreShows &&
            <div>
              <Ionicon color="#66BB6A" className={this.state.loadingShows ? "" : "hidden"} icon="ios-refresh" fontSize="80px" rotate={true} />
              <Ionicon color="#66BB6A" className={this.state.loadingShows ? "hidden" : ""} icon="ios-more" fontSize="100px" />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default view(Shows)