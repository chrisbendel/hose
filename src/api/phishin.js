const base = 'http://phish.in/api/v1/'

export const search = async(query) => {
  let data = await (await fetch(base + 'search/' + query)).json();

  let terms = [];
  let songs = data.data.songs;
  Object.keys(songs).forEach(function(song) {
    let data = songs[song];
    if (data.alias_for) {
      terms.push(data.alias_for);
    }
    terms.push(data.title);
  });

  let tours = data.data.tours;
  let venues = data.data.venues;
  let show = data.data.show;
  let otherShows = data.data.other_shows;

  return terms;
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