const base = 'http://phish.in/api/v1/'

export const shows = async() => {
  let data = await (await fetch(base + 'shows')).json();
  return data.data;
}