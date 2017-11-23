const base = 'http://phish.in/api/v1/'

export const show = async(id) => {
  let data = await (await fetch(base + 'shows/' + id)).json();
  return data.data;
}
export const shows = async() => {
  let data = await (await fetch(base + 'shows')).json();
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

  let terms = {};

  if (!data.data) {
    return terms;
  }

  let show = data.data.show;
  if (show) {
    terms[show.date + " " + show.venue_name + ", " + show.location] = show;
    terms[show.date + " " + show.venue_name + ", " + show.location]['path'] = '/shows/' + show.id;
  }

  let otherShows = data.data.other_shows;
  if (otherShows) {
    Object.keys(otherShows).forEach(function(show) {
      let values = otherShows[show];
      terms[values.date + " " + values.venue_name + ", " + values.location] = values;
      terms[values.date + " " + values.venue_name + ", " + values.location]['path'] = '/shows/' + values.id;
    });
  }

  let songs = data.data.songs;
  if (songs) {
    Object.keys(songs).forEach(function(song) {
      let values = songs[song];
      if (values.alias_for) {
        //ignore aliases for now
      } else {
        terms[values.title] = values;
        terms[values.title]['path'] = '/songs/' + values.id;
      }
    });
  }

  let tours = data.data.tours;
  if (tours) {
    Object.keys(tours).forEach(function(tour) {
      let values = tours[tour];
      terms[values.name] = values;
      terms[values.name]['path'] = '/tours/' + values.id;
    });
  }

  let venues = data.data.venues;
  if (venues) {
    Object.keys(venues).forEach(function(venue) {
      let values = venues[venue];
      terms[values.name + " " + values.location] = values;
      terms[values.name + " " + values.location]['path'] = '/venues/' + values.id;
    });
  }

  //Maybe return top 10 or so
  return terms;
}
