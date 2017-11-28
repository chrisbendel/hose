const base = 'http://phish.in/api/v1/'

export const randomShow = async() => {
  let data = await (await fetch(base + 'random-show')).json();
  return data.data;
}

export const show = async(id) => {
  let data = await (await fetch(base + 'shows/' + id)).json();
  return data.data;
}

export const shows = async(page = 1) => {
  let data = await (await fetch(base + 'shows?per_page=100&page=' + page)).json();
  return data.data;
}

export const showsForVenue = async(venue) => {
  let data = await (await fetch(base + 'venues/' + venue)).json();
  return data.data.show_ids;
}

export const showsForYear = async(year) => {
  let data = await (await fetch(base + 'years/' + year)).json();
  return data.data;
}

export const showsToday = async(day) => {
  let data = await (await fetch(base + 'shows-on-day-of-year/' + day)).json();
  return data.data;
}

export const years = async() => {
  let data = await (await fetch(base + 'years')).json();
  return data.data;
}

export const tracks = async() => {
  let data = await (await fetch(base + 'tracks')).json();
  return data.data;
}

export const search = async(query) => {
  let data = await (await fetch(base + 'search/' + query)).json();

  let terms = [];

  if (!data.data) {
    return terms;
  }

  console.log(data.data);

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
      values.path = '/show/' + values.id;
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
      values.path = '/tour/' + values.id;
      values.type = 'tour';
      values.display = values.name;
      terms.push(values);
    });
  }

  let venues = data.data.venues;
  if (venues) {
    Object.keys(venues).forEach(function(venue) {
      let values = venues[venue];
      values.path = '/venue/' + values.id;
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
