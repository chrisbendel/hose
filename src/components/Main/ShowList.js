import React, { Component } from 'react';
import { view } from 'react-easy-state'
import {history} from './../../History';
import Ionicon from 'react-ionicons';
import {isShowJamchart, isShowSoundboard} from './../../Utils';

import Store from './../../Store';

class ShowList extends Component {
  constructor(props) {
    super(props);
  }

  renderShows = shows => {
    return shows.map(function (show, index) {
      let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let date = new Date(show.date + ' 00:00');
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
          <span onClick={() => {history.push('/show/' + show.id)}} className="show-date">
            {date.toLocaleDateString('en-US', dateOptions)}
          </span>
          <span className="show-venue">
            {show.venue ? 
              <span onClick={() => {history.push('/shows/venue/' + show.venue.id)}}>
                {show.venue.name} {show.venue.location}
              </span>
              :
              <span onClick={() => {history.push('/shows/venue/' + show.venue_id)}}>
                {show.venue_name} {show.location}
              </span>
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
      <div className="show-gallery">
        {this.renderShows(shows)}
      </div>
    );
  }
}

export default view(ShowList)