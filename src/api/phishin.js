const base = 'http://phish.in/api/v1/'

export const search = async(query) => {
  let data = await (await fetch(base + 'search/' + query)).json();

  let terms = {};

  let songs = data.data.songs;
  Object.keys(songs).forEach(function(song) {
    let data = songs[song];
    if (data.alias_for) {
      // terms[data.title] = {'slug': data.slug, 'id': data.id};
      terms.push(String(data.alias_for));
    }
    terms.push(String(data.title));
  });

  let tours = data.data.tours;
  Object.keys(tours).forEach(function(tour) {
    let data = tours[tour];
    terms.push(String(data.name));
  });

  let venues = data.data.venues;
  Object.keys(venues).forEach(function(venue) {
    let data = venues[venue];
    terms[data.title] = {'slug': data.slug, 'id': data.id};
    // if (data.alias_for) {
    //   terms.push(String(data.alias_for));
    // }
    terms.push(String(data.title));
  });

  let show = data.data.show;
  let otherShows = data.data.other_shows;

  return terms.slice(0, 10);
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