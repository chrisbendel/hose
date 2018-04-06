import Store from './../Store';
import jwt_decode from 'jwt-decode'; 

const base = "https://hose-api-dev.herokuapp.com/api/";

const userRequest = async (method, body = null) => {
  if (!localStorage.getItem('jwt')) {
    return Promise.resolve();
  }
  
  const token = localStorage.getItem('jwt').replace(/"/g, "");
  const decodedToken = jwt_decode(token);

  if (decodedToken.exp < Math.round(Date.now() / 1000)) {
    const newToken = await refreshToken(token);
    localStorage.setItem('jwt', newToken);
  }

  let req = {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt').replace(/"/g, "")
    }
  }
  
  if (method == "POST") {
    req.body = body
  }

  return req;
}

export const getUser = async () => {
  if (!Store.user) {
    return;
  }

  let req = await userRequest("GET");
  return fetch(base + "user", req)
  .then(res => {
    if (!res.ok) {
      return Promise.resolve();
    }
    return res.json();
  })
  .then(data => data);
}

export const getUserInfo = async () => {
  let req = await userRequest("GET");
  return fetch(base + "user/info", req)
  .then(res => {
    if (!res.ok) {
      return Promise.resolve();
    }
    return res.json();
  })
  .then(data => data);
}

export const likeTrack = async id => {
  if (!Store.user) {
    return;
  }
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch(base + "song/like", req)
  .then(res => {
    if (!res.ok) {
      return Promise.resolve();
    }
    return res.json();
  })
  .then(data => data);
}

export const dislikeTrack = async id => {
  if (!Store.user) {
    return;
  }
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch(base + "song/dislike", req)
  .then(res => {
    if (!res.ok) {
      return Promise.resolve();
    }
    return res.json();
  })
  .then(data => data);
}

export const listen = async id => {
  if (!Store.user) {
    return;
  }
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch(base + "song/listen", req)
  .then(res => {
    if (!res.ok) {
      return Promise.resolve();
    }
    if(res.status !== 204) {
      return res.json();
    }
  })
  .then(data => data);
}

export const completed = async id => {
  if (!Store.user) {
    return;
  }
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch(base + "song/completed", req)
  .then(res => {
    if (!res.ok) {
      return Promise.resolve();
    }
    return res.json();
  })
  .then(data => data);
}

export const skipped = async id => {
  if (!Store.user) {
    return;
  }
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch(base + "song/skipped", req)
  .then(res => {
    return Promise.resolve();
  });
}

export const createModel = async () => {
  if (!Store.user) {
    return;
  }
  let req = await userRequest("GET");
  return fetch(base + "user/make-profile", req)
  .then(res => {
    return Promise.resolve()
  })
}

export const createPlaylist = async () => {
  if (!Store.user) {
    return;
  }
  let req = await userRequest("GET");
  return fetch(base + "user/make-playlist", req)
  .then(res => {
    return Promise.resolve();
  })
}

export const getPlaylist = async () => {
  if (!Store.user) {
    return null;
  }
  let req = await userRequest("GET");
  return fetch(base + "user/playlist", req)
  .then(res => {
    if (!res.ok) {
      return Promise.resolve();
    }
    if(res.status !== 204) {
      return res.json();
    }
  })
  .then(data => data);
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
  .then(data => data);
}

export const refreshToken = () => {
  if (!localStorage.getItem('jwt')) {
    return Promise.resolve();
  }
  
  const token = localStorage.getItem('jwt').replace(/"/g, "");
  const decodedToken = jwt_decode(token);

  let req = {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt').replace(/"/g, "")
    },
    body: JSON.stringify({
      access_token: token
    })
  }

  return fetch("https://hose-api-dev.herokuapp.com/public/token/refresh", req)
  .then(res => res.json())
  .then(data => {
    return data.token.replace(/"/g, "");
  })
}