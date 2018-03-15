[
  "https://hose-api-dev.herokuapp.com/api/song/listen",
  "https://hose-api-dev.herokuapp.com/api/song/like",
  "https://hose-api-dev.herokuapp.com/api/song/dislike",
  "https://hose-api-dev.herokuapp.com/api/song/completed"
]
const base = "https://hose-api-dev.herokuapp.com/api/";

export const likeTrack = id => {
  fetch(base + "song/like", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      song_id: id
    })
  })
}