import {apikey} from './../config';

const base = 'https://api.phish.net/v3'

export const showDetails = async(date) => {
  date = date.split('-');
  let data = await (await fetch(`${base}/shows/query?apikey=${apikey}&year=${date[0]}&month=${date[1]}&day=${date[2]}`)).json();
  return data.response.data[0];
}