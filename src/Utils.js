//TODO move the soundboard, jamchart, datetime helpers into here and import them where used.
import {trackJamcharts, trackSoundboards, showJamcharts, showSoundboards, tourFilters} from './filterOptions';

export const getLikesPercent = (tracks, likes) => {
  const max = Math.max.apply(Math, tracks.map(function(o) {
    return o.likes_count;
  }));
  let percent = Math.ceil((likes / max) * 100);
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

export const msToSec = time => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const getTourName = id => {
  return tourFilters.find(tour => {
    return tour.value == id;
  }).label;
}