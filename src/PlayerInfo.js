import {emitter} from './Emitter';

class PlayerInfo {
  show = {};
  track = {};
  position = null;

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
}

export default new PlayerInfo();