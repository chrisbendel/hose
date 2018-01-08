const base = 'https://phish.in/api/v1/'

//Tours
const tours = async() => {
  let data = await (await fetch(base + 'tours?sort_attr=starts_on&per_page=1000')).json();
  return data.data;
}

export let tourFilters;

tours().then(data => {
  tourFilters = data.map(tour => {
    return {
      label: tour.name, 
      value: tour.id, 
      showCount: tour.shows_count
    };
  });
});

//Venues
const venues = async() => {
  let data = await (await fetch(base + 'venues?sort_attr=shows_count&sort_dir=desc&per_page=50000')).json();
  return data.data;
}

export let venueFilters;

venues().then(data => {
  venueFilters = data.map(venue => {
    return {
      label: venue.name,
      value: venue.id,
      showCount: venue.shows_count
    };
  });
});

//Songs
const songs = async() => {
  let data = await (await fetch(base + 'songs?sort_attr=tracks_count&sort_dir=desc&per_page=50000')).json();
  return data.data;
}

export let songFilters;

songs().then(data => {
  songFilters = data.map(song => {
    return {
      label: song.title,
      value: song.alias_for ? song.alias_for : song.id
    };
  });
});

//Years
const years = async() => {
  let data = await (await fetch(base + 'years')).json();
  return data.data;
}

export let yearFilters;

years().then(data => {
  yearFilters = data.map(year => {
    return {
      label: year,
      value: year
    };
  });
  yearFilters.push({label: "All Shows", value: "all"});
  yearFilters.reverse();
});

//Track soundboards
const trackSBD = async() => {
  let data = await (await fetch(base + 'tracks?tag=SBD&per_page=50000')).json();
  return data.data;
}

export let trackSoundboards;

trackSBD().then(data => {
  trackSoundboards = data.map(track => {
    return track.id;
  });
});


//Track Jamcharts
const trackJams = async() => {
  let data = await (await fetch(base + 'tracks?tag=Jamcharts&per_page=50000')).json();
  return data.data;
}

export let trackJamcharts;

trackJams().then(data => {
  trackJamcharts = data.map(track => {
    return track.id;
  });
});

//Show soundboards
const showSBD = async() => {
  let data = await (await fetch(base + 'tracks?tag=Jamcharts&per_page=50000')).json();
  return data.data;
}

export let showSoundboards;

showSBD().then(data => {
  showSoundboards = data.map(show => {
    return show.id;
  });
});


//Show Jamcharts
const showJams = async() => {
  let data = await (await fetch(base + 'shows?tag=Jamcharts&per_page=50000')).json();
  return data.data;
}

export let showJamcharts;

showJams().then(data => {
  showJamcharts = data.map(show => {
    return show.id;
  });
});

export const sortByOptions = [
  {label: 'Jamcharts', value: "jamcharts", attr: "jamcharts", order: "desc"},
  {label: 'Likes', value: "popular", attr: "likes_count", order: "desc"},
  {label: 'Date (Recent)', value: "recent", attr: "date", order: "desc"},
  {label: 'Date (Older)', value: "older", attr: "date", order: "asc"},
];