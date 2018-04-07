import React, { Component } from 'react';
import { view } from 'react-easy-state'
import {history} from './../../History';
import Ionicon from 'react-ionicons';
import {tourFilters} from './../../filters';
import {isShowJamchart, isShowSoundboard} from './../../Utils';
import Store from './../../Store';
import moment from 'moment';

class ShowList extends Component {
  renderShowTourSection = shows => {
    const tours = [...new Set(shows.map(show => show.tour_id))];

    return tours.map(tour => {
      let foundTour = tourFilters.find(searchTour => searchTour.value === tour);
      return (
        <div key={tour}>
          <h1>{foundTour.label}</h1>
          <hr/>
          <div className="show-gallery">
            {this.renderShows(shows, tour)}
          </div>
        </div>
      )
    });
  }
  renderShows = (shows, tour) => {
    return shows.filter(show => {
      return show.tour_id === tour;
    }).map((show, index) => {
      return (
        <div key={show.id} onClick={() => {history.push('/show/' + show.id)}} className="image-container">
          <div className="show-information-control">
            <div className="show-tags">
              {show.remastered && <div className="tag">Remastered</div>}
              {isShowJamchart(show.id) && <div className="tag">Jamcharts</div>}
              {isShowSoundboard(show.id) && <div className="tag">Soundboard</div>}
            </div>
            <img
              src={'/images/' + show.date + '.jpg'}
              alt={show.id}
              id={show.id}
            />
            <div className={Store.isShowPlaying(show) ? "show-information-active" : "show-information"}>
              <div className="center-abs">
                {Store.isShowPlaying(show) ?
                <div onClick={(e) => {
                  Store.pause();
                  e.stopPropagation();
                }}>
                  <Ionicon 
                    icon="ios-pause" 
                    fontSize="60px"
                    color="white"
                  />
                </div>
                :
                <div onClick={(e) => {
                  Store.playShow(show.id);
                  e.stopPropagation();
                }}>
                  <Ionicon 
                    icon="ios-play" 
                    fontSize="60px" 
                    color="white"
                  />
                </div>
                }

                <div className="show-likes">
                  <Ionicon
                    icon="ios-thumbs-up"
                    fontSize="20px"
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
          <h3 onClick={() => {history.push('/show/' + show.id)}} className="show-date">
            {moment(show.date).format('LL')}
          </h3>
          <span className="show-venue">
            {show.venue ? 
              <div onClick={() => {history.push('/shows/venue/' + show.venue.id)}}>
                <p className="show-location">{show.venue.name}</p>
                <p className="show-location">{show.venue.location}</p>
              </div>
              :
              <div onClick={() => {history.push('/shows/venue/' + show.venue_id)}}>
                <p className="show-location">{show.venue_name}</p>
                <p className="show-location">{show.location}</p>
              </div>
            }
          </span>
        </div>
      );
    });
  }

  render() {
    const {shows} = this.props;

    if (!shows.length) {
      return <div> No Shows Found </div>
    }

    return (
      // <div className="show-gallery">
      <div>
        {this.renderShowTourSection(shows)}
        {/* {this.renderShows(shows)} */}
      </div>
    );
  }
}

export default view(ShowList)