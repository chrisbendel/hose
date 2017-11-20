const base = 'http://phish.in/api/v1/'

export const search = async(query) => {
  let data = await (await fetch(base + 'search/' + query)).json();
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