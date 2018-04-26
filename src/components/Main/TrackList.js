import React, { Component } from 'react';
import { view } from 'react-easy-state'
import Ionicon from 'react-ionicons';
import {likeTrack} from './../../api/hose';
import {isTrackJamchart, isTrackSoundboard, getLikesPercent, formatTime} from './../../Utils';
import Store from './../../Store';
import { NavLink } from 'react-router-dom';
import Spinner from 'react-spinkit';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'

class TrackList extends Component {
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
                  <div onClick={(e) => {
                    Store.pause();
                  }}>
                    <Ionicon 
                      icon="ios-pause"
                      fontSize="25px"
                      color="white"
                    />
                  </div>
                :
                  <div onClick={(e) => {
                    Store.playShow(track.show_id, track.position);
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
          <span className="like-cell">
            <Ionicon 
              icon={Store.userLikes.indexOf(track.id) > -1 ? "ios-thumbs-up" : "ios-thumbs-up-outline"}
              font-size="40px"
              className="clickable"
              color="#4CAF50"
              onClick={() => {
                likeTrack(track.id).then(track => {
                  Store.updateUserLikes();
                });
              }}
            />
          </span>
          <span className="title-cell">{track.title}</span>
          <span className="length-cell">{formatTime(track.duration)}</span>
          <NavLink className="title-cell" to={'/show/' + track.show_id}><span>{track.show_date}</span></NavLink>
          <span className="jamcharts-cell">{isTrackJamchart(track.id) ? "Jamcharts" : ""}</span>
          <span className="jamcharts-cell">{isTrackSoundboard(track.id) ? "Soundboard" : ""}</span>
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

  renderTracksForYear = tracks => {
    const years = [...new Set(tracks.map(track => {
      let year = parseInt(track.show_date.substring(0, 4), 10);
      return year;
    }))].sort((a, b) => b-a);

    return years.map(year => {
      let tracksForYear = tracks.filter(track => {
        return parseInt(track.show_date.substring(0, 4), 10) === year;
      });
      return (
        <div key={year}>
          <h2>{year}</h2>
          <hr/>
          {this.renderTracks(tracksForYear)}
        </div>
      );
    });
  }

  renderTrackContainer = tracks => {
    return (
      <div>
        <h2>{this.props.songName}</h2>
        <button className={this.props.currentFilter === "jamcharts" ? "track-filter active" : "track-filter"} onClick={() => {
          this.props.sortTracks('jamcharts');
        }}>
          Jamcharts
        </button>
        <button className={this.props.currentFilter === "soundboard" ? "track-filter active" : "track-filter"} onClick={() => {
          this.props.sortTracks('soundboard');
        }}>
          Soundboards
        </button>
        <button className={this.props.currentFilter === "likes_count" ? "track-filter active" : "track-filter"} onClick={() => {
          this.props.sortTracks('likes_count');
        }}>
          Popular
        </button>
        <button className={this.props.currentFilter === "duration" ? "track-filter active" : "track-filter"} onClick={() => {
          this.props.sortTracks('duration');
        }}>
          Longest
        </button>
        <ul className="playlist-section">
          {this.renderTracksForYear(tracks)}
        </ul>
      </div>
    )
  }

  render() {
    const {tracks} = this.props;
    return this.renderTrackContainer(tracks);
  }
}

export default view(TrackList)