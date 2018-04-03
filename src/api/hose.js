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
  let req = await userRequest("GET");
  return fetch(base + "user", req)
  // .then(res => {
  //   if (res.status === 200) {
  //     return res.json();
  //   }
  // })
  // .then(res => res.json())
  .then(res => {
    if (!res.ok) {
      return;
    }
    return res.json();
  })
  .then(data => data)
  .catch(err => {
    return Promise.reject(err);
  });
}

export const likeTrack = async id => {
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/like", req)
  // .then(res => {
  //   if (res.status === 200) {
  //     return res.json();
  //   }
  // })
  .then(res => {
    if (!res.ok) {
      return;
    }
    return res.json();
  })
  // .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const dislikeTrack = async id => {
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
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/dislike", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const listen = async id => {
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
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/listen", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const completed = async id => {
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/completed", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const skipped = async id => {
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
  let req = await userRequest("POST", JSON.stringify({song_id: id}));
  return fetch (base + "song/skipped", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const createModel = async () => {
  let req = await userRequest("GET");
  return fetch(base + "user/make-profile", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const createPlaylist = async () => {
  let req = await userRequest("GET");
  return fetch(base + "user/make-playlist", req)
  .then(res => res.json())
  .then(data => {
    return data;
  });
}

export const getPlaylist = async () => {
  let req = await userRequest("GET");
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