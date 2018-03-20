import React, { Component } from 'react';
import { view } from 'react-easy-state'
import { history } from './../../History';
import Ionicon from 'react-ionicons';
import {isTrackJamchart, isTrackSoundboard, getLikesPercent, msToSec} from './../../Utils';
import Store from './../../Store';
import { NavLink } from 'react-router-dom';
import Spinner from 'react-spinkit';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'


class TrackList extends Component {
  constructor(props) {
    super(props);
  }

  renderTracks = tracks => {
    return tracks.map(track => {
      return (
        <li className="show-container-item" key={track.id}>
          <div className="show-information-control image-cell">
            <img
              src={'/images/' + track.show_date + '.jpg'}
              className="image-cell"
              alt={track.show_id}
              id={track.id}
            />
            <div className="show-information">
              <div className="center-abs">
                {Store.isTrackPlaying(track) ? 
                  <div className="play-button" onClick={(e) => {
                    Store.pause();
                  }}>
                    <Ionicon 
                      icon="ios-pause" 
                      fontSize="25px" 
                      color="white"
                    />
                  </div>
                :
                  <div className="play-button" onClick={(e) => {
                    Store.playTrack(track.show_id, track);
                  }}>
                    <Ionicon 
                      icon="ios-play" 
                      fontSize="25px" 
                      color="white"
                    />
                  </div>
                }
              </div>
            </div>
          </div>
          <span className="playing-cell">
            {Store.isTrackPlaying(track) && <Spinner color='#4CAF50' name='line-scale-pulse-out-rapid' />}
          </span>
          <span className="title-cell">{track.title}</span>
          <NavLink className="title-cell" to={'/show/' + track.show_id}><span>{track.show_date}</span></NavLink>
          <span className="jamcharts-cell">{isTrackJamchart(track.id) ? "Jamcharts" : ""}</span>
          <span className="jamcharts-cell">{isTrackSoundboard(track.id) ? "Soundboard" : ""}</span>
          <span className="length-cell">{msToSec(track.duration)}</span>
          <span className="likes-cell">
            <Tooltip
              trigger="mouseenter"
              interactive
              inertia={false}
              arrow={true}
              animation="fade"
              arrowSize={"small"}
              duration={200}
              html={<span>{track.likes_count} {track.likes_count === 1 ? "Like" : "Likes"}</span>}
            >
              <div className="likes-bar">
                <div 
                  className="inside-bar"
                  style={{width: getLikesPercent(tracks, track.likes_count)}}
                >
                </div>
              </div>
            </Tooltip>
          </span>
        </li>
      );
    });
  }


  renderTrackContainer = tracks => {
    return (
      <ul className="playlist-section">
        <li className="show-container-item header-cell">
          <span className="image-cell-header"></span>
          <span className="playing-cell"></span>
          <span className="title-cell">Song</span>
          <span className="title-cell" onClick={() => {this.sortTracks('date')}}>Date</span>
          <span className="jamcharts-cell" onClick={() => {this.sortTracks('jamcharts')}}>Jamcharts</span>
          <span className="jamcharts-cell" onClick={() => {this.sortTracks('soundboard')}}>Soundboard</span>
          <span className="length-cell">
            <Ionicon
              style={{cursor: 'pointer'}}
              icon="md-time"
              color="black"
              onClick={() => {this.sortTracks('duration')}}
            />
          </span>
          <span className="likes-cell">
            <Ionicon 
              style={{cursor: 'pointer'}}
              icon="md-heart-outline"
              font-size="30px"
              color="black"
              onClick={() => {this.sortTracks('likes_count')}}
            />
          </span>
        </li>
        {this.renderTracks(tracks)} 
      </ul>
    )
  }

  render() {
    const {tracks} = this.props;

    if (!tracks.length) {
      return <div> Search for a song to find all of it's performances </div>
    }

    return (
      <div className="show-gallery">
        {this.renderTrackContainer(tracks)}
      </div>
    );
  }
}

export default view(TrackList)