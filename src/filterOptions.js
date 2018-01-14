const base = 'https://phish.in/api/v1/'

//Tours
const tours = async() => {
  let data = await (await cachedFetch(base + 'tours?sort_attr=starts_on&per_page=1000')).json();
  return data.data;
}

export let tourFilters;

//Venues
const venues = async() => {
  let data = await (await cachedFetch(base + 'venues?sort_attr=shows_count&sort_dir=desc&per_page=50000')).json();
  return data.data;
}

export let venueFilters;

//Songs
const songs = async() => {
  let data = await (await cachedFetch(base + 'songs?sort_attr=tracks_count&sort_dir=desc&per_page=50000')).json();
  return data.data;
}

export let songFilters;

//Years
const years = async() => {
  let data = await (await cachedFetch(base + 'years')).json();
  return data.data;
}

export let yearFilters;

//Track soundboards
const trackSBD = async() => {
  let data = await (await cachedFetch(base + 'tracks?tag=SBD&per_page=50000')).json();
  return data.data;
}

export let trackSoundboards;

//Track Jamcharts
const trackJams = async() => {
  let data = await (await cachedFetch(base + 'tracks?tag=Jamcharts&per_page=50000')).json();
  return data.data;
}

export let trackJamcharts;

//Show soundboards
const showSBD = async() => {
  let data = await (await cachedFetch(base + 'tracks?tag=Jamcharts&per_page=50000')).json();
  return data.data;
}

export let showSoundboards;

//Show Jamcharts
const showJams = async() => {
  let data = await (await cachedFetch(base + 'shows?tag=Jamcharts&per_page=50000')).json();
  return data.data;
}

export let showJamcharts;

export const sortByOptions = [
  {label: 'Jamcharts', value: "jamcharts", attr: "jamcharts", order: "desc"},
  {label: 'Soundboard', value: "soundboard", attr: "soundboard", order: "desc"},
  {label: 'Likes', value: "popular", attr: "likes_count", order: "desc"},
  {label: 'Date (Recent)', value: "recent", attr: "date", order: "desc"},
  {label: 'Date (Older)', value: "older", attr: "date", order: "asc"},
];

export const loadFilters = async() => {
  let tourData = await tours();
  tourFilters = tourData.map(tour => {
    return {
      label: tour.name,
      value: tour.id,
      showCount: tour.shows_count
    };
  }).reverse();

  let venueData = await venues();
  venueFilters = venueData.map(venue => {
    return {
      label: venue.name,
      value: venue.id,
      showCount: venue.shows_count
    };
  });

  let songData = await songs();
  songFilters = songData.map(song => {
    return {
      label: song.title,
      value: song.alias_for ? song.alias_for : song.id
    };
  });

  let yearData = await years();
  yearFilters = yearData.map(year => {
    return {
      label: year,
      value: year
    };
  });
  yearFilters.push({label: "All Shows", value: "all"});
  yearFilters.reverse();

  let trackSBDS = await trackSBD();
  trackSoundboards = trackSBDS.map(track => {
    return track.id;
  });

  let trackData = await trackJams();
  trackJamcharts = trackData.map(track => {
    return track.id;
  });

  let showSBDS = await showSBD();
  showSoundboards = showSBDS.map(show => {
    return show.id;
  });

  let showJamData = await showJams();
  showJamcharts = showJamData.map(show => {
    return show.id;
  });
}

const cachedFetch = (url, options) => {
  let expiry = 1000;
  if (typeof options === 'number') {
    expiry = options
    options = undefined
  } else if (typeof options === 'object') {
    expiry = options.seconds || expiry
  }
  
  let cacheKey = url
  let cached = localStorage.getItem(cacheKey)
  let whenCached = localStorage.getItem(cacheKey + ':ts')
  if (cached !== null && whenCached !== null) {
    let age = (Date.now() - whenCached) / 1000
    if (age < expiry) {
      let response = new Response(new Blob([cached]))
      return Promise.resolve(response)
    } else {
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(cacheKey + ':ts')
    }
  }

  return fetch(url, options).then(response => {
    if (response.status === 200) {
      let ct = response.headers.get('Content-Type')
      if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
        response.clone().text().then(content => {
          localStorage.setItem(cacheKey, content)
          localStorage.setItem(cacheKey+':ts', Date.now().toString())
        })
      }
    }
    return response
  })
}
