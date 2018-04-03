import Store from './../Store';
import jwt_decode from 'jwt-decode'; 

const base = "https://hose-api-dev.herokuapp.com/api/";

const userRequest = async (method, body = null) => {
  // const token = localStorage.getItem('token').replace(/"/g, "");
  const token = localStorage.getItem('token');
  const decodedToken = jwt_decode(token);

  if (decodedToken.exp < Math.round(Date.now() / 1000)) {
    const newToken = await refreshToken(token);
    localStorage.setItem('token', newToken);
  }

  return {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: body || ""
  }
}

export const getTrack = id => {
  let req = userRequest("GET");
  return fetch(base + "song/" + id, req)
  .then(res => res.json())
  .then(data => data);
}

export const getUser = () => {
  let req = userRequest("GET");
  return fetch(base + "user", req)
  .then(res => res.json())
  .then(data => data);
}

export const likeTrack = id => {
  // return fetch(base + "song/like", {
  //   method: "POST",
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + Store.token
  //   },
  //   body: JSON.stringify({
  //     song_id: id
  //   })
  // })
  let req = userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/like", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const dislikeTrack = id => {
  // return fetch(base + "song/dislike", {
  //   method: "POST",
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     song_id: id
  //   })
  // })
  let req = userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/dislike", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const listen = id => {
  // return fetch(base + "song/listen", {
  //   method: "POST",
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     song_id: id
  //   })
  // })
  let req = userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/listen", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const completed = id => {
  // return fetch(base + "song/completed", {
  //   method: "POST",
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     song_id: id
  //   })
  // })
  let req = userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/completed", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const skipped = id => {
  // return fetch(base + "song/skipped", {
  //   method: "POST",
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     song_id: id
  //   })
  // })
  let req = userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/skipped", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const createModel = () => {
  let req = userRequest("GET");
  return fetch(base + "user/make-profile", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const createPlaylist = () => {
  let req = userRequest("GET");
  return fetch(base + "user/make-playlist", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const getPlaylist = () => {
  let req = userRequest("GET");
  return fetch(base + "user/playlist", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const createToken = token => {
  return fetch("https://hose-api-dev.herokuapp.com/public/token/create", {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      socialToken: token
    })
  })
  .then(res => res.json())
  .then(data => {
    return data;
  })
}

export const refreshToken = () => {
  return fetch("https://hose-api-dev.herokuapp.com/public/token/refresh")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    return data;
  })
}