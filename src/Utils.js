/* global WebAssembly */
import {trackJamcharts, trackSoundboards, showJamcharts, showSoundboards, tourFilters} from './filters';
import isElectron from 'is-electron';
import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import funMath from './wasm/math.wasm';

let wasm;
export const loadWasm = async () => {
  let expressions = await fetchWasm(funMath);
  wasm = expressions;
  return Promise.resolve();
}

function fetchWasm (url, imports) {
  return fetch(url)
  .then(res => res.arrayBuffer())
  .then(bytes => WebAssembly.compile(bytes))
  .then(module => WebAssembly.instantiate(module, imports || {}))
  .then(instance => instance.exports);
}

export const shuffle = array => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const getLikesPercent = (tracks, likes) => {
  const max = Math.max.apply(Math, tracks.map(function(o) {
    return o.likes_count;
  }));
  // let percent = Math.ceil((likes / max) * 100);
  let percent = wasm.percent(likes, max);
  return percent > 0 ? percent + "%" : "5px";
}

export const isTrackJamchart = id => {
  return trackJamcharts.indexOf(id) !== -1;
}

export const isTrackSoundboard = id => {
  return trackSoundboards.indexOf(id) !== -1;
}

export const isShowJamchart = id => {
  return showJamcharts.indexOf(id) !== -1;
}

export const isShowSoundboard = id => {
  return showSoundboards.indexOf(id) !== -1;
}

export const seekTime = (offset, offsetWidth, duration) => {
  return wasm.seekTime(offset, offsetWidth, duration);
}

export const msFormatJs = time => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000);

  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const msFormat = time => {
  // Old code for comparisons
  // var minutes = Math.floor(time / 60000);
  // var seconds = ((time % 60000) / 1000).toFixed(0);
  
  //Wasm code
  let minutes = wasm.msToMinutes(time);
  let seconds = wasm.msToSeconds(time);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const benchmark = () => {
  console.log(wasm.test(50));
  let time = 23412309;
  let t1 = performance.now();
  for (let i = 0; i < 10000; i++) {
    var timestamp = msFormatJs(time);
    // var minutes = Math.floor(time / 60000);
    // var seconds = ((time % 60000) / 1000);
  }
  let t2 = performance.now();
  console.log("JS took: " + (t2-t1) + " milliseconds");

  let t3 = performance.now();
  for (let i = 0; i < 100000; i++) {
    // const likes = 12;
    // const max = 28;
    // let percent = wasm.percent(likes, max);
    var timestamp = msFormat(time);
  }
  let t4 = performance.now();
  console.log("WASM  took: " + (t4-t3) + " milliseconds");
}

export const secFormat = time => {
  let seconds = wasm.secToSeconds(time);
  let minutes = wasm.secToMinutes(time);

  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const getTourName = id => {
  return tourFilters.find(tour => {
    return tour.value === id;
  }).label;
}

export const mapTracks = tracks => {
  return tracks.map(track => {
    return {id: track.id, name: track.title, src: track.mp3}
  });
}

export const downloadShow = (show) => {
  if (isElectron()) {
    var {remote} = window.require('electron');
    var remoteWindow = remote.getCurrentWindow();
  }
  let tracks = show.tracks;
  var zip = new JSZip();
  let count = 0;
  let showName = show.date + "-" + show.venue.name + "-" + show.venue.location;
  tracks.forEach(track => {
    let title = track.title + ".mp3";
    JSZipUtils.getBinaryContent(track.mp3, (err, data) => {
      zip.file(title, data, {binary: true});
      count++;
      if (isElectron()) {
        remoteWindow.setProgressBar(count / tracks.length);
      }
      if (count === tracks.length) {
        zip.generateAsync({type:'blob'}, (metadata) => {
          if (isElectron()) {
            remoteWindow.setProgressBar(metadata.percent);
          }
        })
        .then(content => {
          saveAs(content, showName + ".zip");
          if (isElectron()) {
            remoteWindow.setProgressBar(-1);
          }
        });
      }
    });
  });
}
