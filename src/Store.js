import { store } from 'react-easy-state'
import { show } from './api/phishin';

export default store({
  player: null,
  show: null,
  track: null,
  playing: false,
  radio: false,
  playShow (showID) {
    if (this.show && showID == this.show.id) {
      this.player.play();
    } else {
      show(showID).then(show => {
        this.track = show.tracks[0];
        this.show = show;
        this.radio = false;
        this.player.setPlaylistPosition(this.track.position);
        this.player.play();
      });
    }
  },
  playRadio(show, track) {
    this.playing = true;
    this.show = show;
    this.track = track;
    this.radio = true;
  },
  playTrack(showID, track) {
    this.playing = true;
    this.radio = false;
    if (!this.track) {
      show(showID).then(show => {
        this.show = show;
        this.track = track;
        this.player.setPlaylistPosition(track.position);
        this.player.play();
      });
    } else {
      if (track.id != this.track.id) {
        show(showID).then(show => {
          this.show = show;
          this.track = track;
          this.player.setPlaylistPosition(track.position);
          this.player.play();
        });
      } else {
        this.player.play();
      }
    }
  },
  pause() {
    this.playing = false;
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