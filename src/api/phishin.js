// import {pts} from './../config';
// import {Base64} from "js-base64"
const base = 'https://phish.in/api/v1/'

// export const playsCount = async(track) => {
//   let headers = new Headers();
//   headers.append('Authorization', 'Basic ' + Base64.encode(pts + ":" + ""));

//   let data = await (await fetch ("https://www.phishtrackstats.com/api/v2/hotbox.json?q=1997-07-24/the-wedge", {
//     headers: headers
//   })).json();

//   let playCount = data.stats.find(stat => {
//     return stat.name == "total_count"
//   }).value;

//   return playCount;
// }

export const cacheTrack = async id => {
  let track = await trackInfo(id);
  return fetch(track.mp3);
}

export const fetchRandomTrack = async() => {
  let data = await (await fetch(base + 'tracks?per_page=100', {cache: "force-cache"})).json();
  return data.data;
}

export const trackInfo = async(id) => {
  let data = await (await fetch(base + 'tracks/' + id, {cache: "force-cache"})).json();
  return data.data;
}

export const randomShow = async() => {
  let data = await (await fetch(base + 'random-show', {cache: "force-cache"})).json();
  return data.data;
}

export const show = async(id) => {
  let data = await (await fetch(base + 'shows/' + id, {cache: "force-cache"})).json();
  return data.data;
}

export const shows = async(page = 1) => {
  let data = await (await fetch(base + 'shows?sort_attr=date&sort_dir=desc&per_page=50&page=' + page, {cache: "force-cache"})).json();
  return data.data;
}

export const tracksForSong = async(track) => {
  let data = await (await fetch(base + 'songs/' + track, {cache: "force-cache"})).json();
  return data.data.tracks;
}

export const showsForVenue = async(venue) => {
  let data = await (await fetch(base + 'venues/' + venue, {cache: "force-cache"})).json();
  return data.data.show_ids;
}

export const showsForYear = async(year) => {
  let data = await (await fetch(base + 'years/' + year, {cache: "force-cache"})).json();
  return data.data;
}

export const showsForTour = async(tour) => {
  let data = await (await fetch(base + 'tours/' + tour, {cache: "force-cache"})).json();
  return data.data;
}

export const showsToday = async(day) => {
  let data = await (await fetch(base + 'shows-on-day-of-year/' + day + '?per_page=100', {cache: "force-cache"})).json();
  return data.data;
}

export const years = async() => {
  let data = await (await fetch(base + 'years', {cache: "force-cache"})).json();
  return data.data;
}

export const tours = async() => {
  let data = await (await fetch(base + 'tours?sort_attr=starts_on&per_page=1000', {cache: "force-cache"})).json();
  return data.data;
}

export const venues = async() => {
  let data = await (await fetch(base + 'venues?per_page=1000&sort_attr=shows_count&sort_dir=desc', {cache: "force-cache"})).json();
  return data.data;
}

export const tracks = async() => {
  let data = await (await fetch(base + 'tracks', {cache: "force-cache"})).json();
  return data.data;
}

export const search = async(query) => {
  let data = await (await fetch(base + 'search/' + query, {cache: "force-cache"})).json();

  let terms = [];

  if (!data.data) {
    return terms;
  }

  let show = data.data.show;
  if (show) {
    show.path = '/show/' + show.id;
    show.type = 'show';
    show.display = show.date + " " + show.venue_name + " " + show.location;    
    terms.push(show);
  }

  let otherShows = data.data.other_shows;
  if (otherShows) {
    Object.keys(otherShows).forEach(function(show) {
      let values = otherShows[show];
      values.path = '/shows/' + values.id;
      values.type = 'show';
      values.display = values.date + " " + values.venue_name + " " + values.location;
      terms.push(values);
    });
  }

  let songs = data.data.songs;
  if (songs) {
    Object.keys(songs).forEach(function(song) {
      let values = songs[song];
      values.type = 'song';
      values.display = values.title;
      if (values.alias_for) {
        values.path = '/song/' + values.alias_for;
      } else {
        values.path = '/song/' + values.id;
      }
      terms.push(values);
    });
  }

  let tours = data.data.tours;
  if (tours) {
    Object.keys(tours).forEach(function(tour) {
      let values = tours[tour];
      values.path = '/shows/tour/' + values.id;
      values.type = 'tour';
      values.display = values.name;
      terms.push(values);
    });
  }

  let venues = data.data.venues;
  if (venues) {
    Object.keys(venues).forEach(function(venue) {
      let values = venues[venue];
      values.path = '/shows/venue/' + values.id;
      values.type = 'venue';
      if (values.past_names) {
        values.display = values.name + " " + values.location + " (" + values.past_names + ")";
      } else {
        values.display = values.name + " " + values.location;
      }
      terms.push(values);
    });
  }

  return terms;
}
