import React, { Component } from 'react';
import './../../css/Player.css'
import Audio from 'react-audioplayer';
import { show } from './../../api/phishin';
import Ionicon from 'react-ionicons';
import ReactDOM from 'react-dom';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'

let onplaying = true;
let onpause = false;

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: null,
      show: null,
      downloading: false
    }

    this.props.emitter.addListener('playlistUpdate', (showId, position = 0) => {
      this.setShow(showId, position);
    });
  }
  
  componentDidUpdate() {
    if (this.player) {
      let element = this.player.audioElement;
      console.log(this.player);
      element.addEventListener('playing', (e) => {
        onplaying = true;
        onpause = false;
        this.props.emitter.emit('positionUpdate', this.player.state.currentPlaylistPos);
      })
      element.addEventListener('pause', (e) => {
        onplaying = false;
        onpause = true;
        console.log('pause');
        // this.props.emitter.emit('positionUpdate', this.player.state.currentPlaylistPos);
      })
    }
  }

  setShow = (showId, position = 0) => {
    show(showId).then(show => {
      let tracks = show.tracks.map(track => {
        return {id: track.id, name: track.title, src: track.mp3}
      });

      this.setState({
        tracks: tracks, 
        show: show
      }, () => {
        this.setPlaylistPosition(position);
      });
    });
  }

  setPlaylistPosition = (index) => {
    this.player.state.currentPlaylistPos = index;
    
    ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-pause'));
    ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-next'));
    ReactDOM.findDOMNode(this.player).dispatchEvent(new Event('audio-skip-to-previous'));
  }

  downloadShow = () => {
    this.setState({downloading: true})
    let tracks = this.state.tracks;
    let show = this.state.show;

    let options = {};
    options.urls = [];
    options.path = show.date;
    tracks.forEach(function (track) {
      options.urls.push(track.src);
    });

    let that = this;
    window.require("electron").remote.require("electron-download-manager").bulkDownload(options, function(error, finished, errors){
      that.setState({downloading: false})
    });
  }

  renderPlaylistContent = (set) => {
    return this.state.show.tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      console.log(track);
      return (
        <li
          className="playlist-container-item" 
          key={track.position}
          onClick={() => {
            this.setPlaylistPosition(track.position - 1);
          }}
        >
          <span> {track.position} - </span>
          <span>{track.title}</span>
        </li>
      );
    });
  }

  renderPlaylistContainer = () => {
    let that = this;
    const sets = [...new Set(this.state.show.tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <div key={set}>
          <p> {set} </p>
          <ul className="playlist-section"> {that.renderPlaylistContent(set)} </ul>
        </div>
      )
    });
  }
  
  render() {
    let show = this.state.show;
    let tracks = this.state.tracks;

    if (!tracks) {
      return (<div> Pick a show or song to start listening </div>);
    }

    return (
      <div className="controls-container">
        <Ionicon className={this.state.downloading ? "" : "hidden"} icon="ios-refresh" fontSize="60px" rotate={true} />
        <Ionicon className={this.state.downloading ? "hidden" : "clickable"} icon="ios-cloud-download" fontSize="60px" onClick={() => window.confirm("Download this show?") ? this.downloadShow() : null}/>
        <Audio
          ref={audioComponent => { this.player = audioComponent; }}
          width={500}
          height={50}
          autoPlay={true}
          playlist={tracks}
        />
        <Tooltip
          trigger="click"
          interactive
          inertia={true}
          arrow={true}
          animation="scale"
          arrowSize={"big"}
          duration={200}
          html={<div className="playlist-container">{this.renderPlaylistContainer()}</div>}
        >
          <Ionicon className="clickable" icon="ios-list-box" fontSize="60px"/>
        </Tooltip>
        <img style={{width: '50px', height: '50px'}} src={process.env.PUBLIC_URL + '/art/' + show.date + '.jpg'}/> 
      </div>
    );
  }
}