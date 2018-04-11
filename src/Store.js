import { store } from 'react-easy-state'
import { show, trackInfo } from './api/phishin';
import { getUser, getPlaylist, createPlaylist } from './api/hose';
import {trackJamcharts} from './filters';
import {shuffle} from './Utils';

export default store({
  user: null,
  player: null,
  show: null,
  track: null,
  playing: false,
  radio: false,
  nextTrack: null,
  playlist: [],
  position: 1,
  userLikes: [],
  userDislikes: [],
  updateUserLikes() {
    getUser().then(songs => {
      if (songs) {
        let filtered = songs.filter(song => {
          return song.like
        })
        .map(song => {
          return parseInt(song.song_id, 10)
        });
        this.userLikes = filtered;

        let dislikes = songs.filter(song => song.dislike)
        .map(song => parseInt(song.song_id, 10));
        this.userDislikes = dislikes;
      }
    });
  },
  next() {
    if (this.position === this.playlist.length) {
      if (this.radio) {
        createPlaylist();

        getPlaylist().then(playlist => {
          if (playlist && playlist.songs && playlist.songs.length) {
            this.setPlaylist(playlist.songs, true);
          } else {
            let randomTracks = shuffle(trackJamcharts);
            let songIds = randomTracks.slice(0, 100);
            this.setPlaylist(songIds, true);
          }
        })
      } else {
        this.position = 1;
        let id = this.playlist[0];
        this.setCurrentlyPlaying(id);
      }
    } else {
      if (this.position > this.playlist.length / 1.5) {
        createPlaylist();
      }

      this.position += 1;
      let id = this.playlist[this.position - 1];
      let next = this.playlist[this.position];
      this.setCurrentlyPlaying(id, next);
    }
  },
  previous() {
    if (this.position === 1) {
      this.position = this.playlist.length;
      let id = this.playlist[this.position - 1];
      this.setCurrentlyPlaying(id);
    } else {
      this.position -= 1;
      let id = this.playlist[this.position - 1];
      this.setCurrentlyPlaying(id);
    }
  },
  setPlaylist(trackIds, radio = false, position = 1) {
    this.radio = radio;
    this.position = position;
    this.playlist = trackIds;

    if (position > trackIds / 1.2) {
      createPlaylist();
    }

    let next = trackIds[position];
    let current = trackIds.find((id, index) => {
      return index === position - 1;
    });

    this.setCurrentlyPlaying(current, next);
  },
  playShow(id, position = 1) {
    if (this.show && this.show.id === id && this.position === position) {
      this.player.play();
    } else {
      show(id).then(show => {
        let trackIds = show.tracks.map(track => {
          return track.id;
        });
        
        this.setPlaylist(trackIds, false, position);
      });
    }
  },
  setCurrentlyPlaying(id, nextId = null) {
    if (nextId) {
      trackInfo(nextId).then(track => {
        this.nextTrack = track.mp3;
      });
    }

    if (this.track && this.track.id === id) {
      this.player.play();
    } else {
      trackInfo(id).then(track => {
        show(track.show_id).then(show => {
          this.show = show;
          this.track = track;
        });
      });
    }
  },
  pause() {
    this.player.pause();
  },
  isTrackPlaying(track) {
    if (this.track) {
      return this.playing && this.track.id === track.id;
    }

    return false;
  },
  isShowPlaying(show) {
    if (this.show) {
      return this.playing && this.show.id === show.id;
    }

    return false;
  }
});