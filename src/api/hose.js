const base = "https://hose-api-dev.herokuapp.com/api/";

export const getTrack = id => {
  return fetch(base + "song/" + id)
  .then(res => res.json())
  .then(data => data);
}

export const getUser = () => {
  return fetch(base + "user")
  .then(res => res.json())
  .then(data => data);
}

export const likeTrack = id => {
  return fetch(base + "song/like", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      song_id: id
    })
  })
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const dislikeTrack = id => {
  return fetch(base + "song/dislike", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      song_id: id
    })
  })
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const listen = id => {
  return fetch(base + "song/listen", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      song_id: id
    })
  })
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const completed = id => {
  return fetch(base + "song/completed", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      song_id: id
    })
  })
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const skipped = id => {
  return fetch(base + "song/skipped", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      song_id: id
    })
  })
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const createModel = () => {
  return fetch(base + "user/make-profile")
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const createPlaylist = () => {
  return fetch(base + "user/make-playlist")
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const getPlaylist = () => {
  return fetch(base + "user/playlist")
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const createToken = () => {
  return fetch(base + "public/token/create")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    return data;
  })
}

export const refreshToken = () => {
  return fetch(base + "public/token/refresh")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    return data;
  })
}