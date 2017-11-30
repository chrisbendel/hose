import {emitter} from './Emitter';

class PlayerInfo {
  constructor () {
    this.show = null;
    this.track = null;
    this.position = null;
    this.playing = false;

    emitter.addListener('songUpdate', (show, track, position, playing) => {
      this.show = show;
      this.track = track;
      this.position = position;
      this.playing = playing;
    });
  }

  isPlaying = () => {
    return this.playing;
  }

  getShow = () => {
    return this.show;
  }

  getTrack = () => {
    return this.track;
  }

  getPosition = () => {
    return this.position;
  }

  setShow = (s) => {
    this.show = s;
  }

  setTrack = (t) => {
    this.track = t;
  }

  setPosition = (p) => {
    this.position = p;
  }

  pause = () => {
    emitter.emit('pause');
  }

  play = () => {
    emitter.emit('play');
  }

  updateShowAndPosition = (s, p = 1) => {
    emitter.emit('playlistUpdate', s, p - 1);
  }
}

export default new PlayerInfo();