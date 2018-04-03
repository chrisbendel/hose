import { store } from 'react-easy-state'
import { show, trackInfo } from './api/phishin';
import { getUser } from './api/hose';

export default store({
  player: null,
  show: null,
  track: null,
  playing: false,
  playlist: [],
  position: 1,
  userLikes: [],
  updateUserLikes() {
    getUser().then(songs => {
      if (songs) {
        let filtered = songs.filter(song => {
          return song.like
        })
        .map(song => {
          return parseInt(song.song_id)
        });
        this.userLikes = filtered;
      }
    });
  },
  next () {
    if (this.position == this.playlist.length) {
      this.position = 1;
      let id = this.playlist[0];
      this.setCurrentlyPlaying(id);
    } else {
      this.position += 1;
      let id = this.playlist[this.position - 1];
      this.setCurrentlyPlaying(id);
    }
  },
  previous() {
    if (this.position == 1) {
      this.position = this.playlist.length;
      let id = this.playlist[this.position - 1];
      this.setCurrentlyPlaying(id);
    } else {
      this.position -= 1;
      let id = this.playlist[this.position - 1];
      this.setCurrentlyPlaying(id);
    }
  },
  setPlaylist (trackIds, position = 1) {
    this.position = position;
    this.playlist = trackIds;

    let current = trackIds.find((id, index) => {
      if (index == position - 1) {
        return id;
      }
    });

    this.setCurrentlyPlaying(current);
  },
  playShow (id, position = 1) {
    if (this.show && this.show.id == id && this.position == position ) {
      this.player.play();
    } else {
      show(id).then(show => {
        let trackIds = show.tracks.map(track => {
          return track.id;
        });
        
        this.setPlaylist(trackIds, position);
      });
    }
  },
  setCurrentlyPlaying (id) {
    if (this.track && this.track.id == id) {
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
      return this.playing && this.track.id == track.id;
    }

    return false;
  },
  isShowPlaying(show) {
    if (this.show) {
      return this.playing && this.show.id == show.id;
    }

    return false;
  }
});