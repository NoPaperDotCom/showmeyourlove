import AppError from "@/utils/error";

const _fetch = async (url, method, headers = {}, body = {}, abortController = new AbortController()) => {
  const _url = `${process.env.PARSE_SERVER_URL}${url}`;
  const _body = (method === "GET") ? Object.keys(body).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`).join("&") : JSON.stringify(body);
  const _parseAPI = {
    "X-Parse-REST-API-Key": process.env.PARSE_REST_API_KEY,
    "X-Parse-Application-Id": process.env.PARSE_APPLICATION_ID
  };

  return await fetch(_url, {
    method,
    headers: {
      ...((method === "GET") ? {} : { "Content-Type": "application/json" }),
      ..._parseAPI,
      ...headers
    },
    signal: abortController.signal,
    ...((method === "GET") ? {} : { body: _body })
  });
};

export const callParseMethod = async (name, params = {}, abortController = new AbortController()) => {
  try {
    const _response = await _fetch(`/functions/${name}`, "POST", {}, params, abortController);
    if (_response.status !== 200) { return new AppError({ text: "parse-error", status: _response.status, message: _response.statusText }); }

    const _data = await _response.json();
    if (!_data.result) { throw new Error("No feedback"); }
    if (_data.result.error) { throw new Error(_data.result.error); }
    return _data.result;
  } catch (error) {
    return new AppError({ message: error.message });
  }
};

export const validUserSessionToken = async (sessionToken = "", abortController = new AbortController()) => {
  try {
    const _response = await _fetch("/users/me", "GET", { "X-Parse-Session-Token": sessionToken }, {}, abortController);
    if (_response.status !== 200) { return new AppError({ text: "session-invalidation", status: _response.status, message: _response.statusText }); }

    const _user = await _response.json();
    if (_user.code === 209) { return new AppError({ text: "session-invalidation", status: 209, message: _user.error }); }
    return { objectId: _user.objectId, name: _user.name, email: _user.email, expiredDate: _user.expiredDate, sessionToken }; 
  } catch (error) {
    return new AppError({ message: error.message });
  }
};

export const updateUser = async (objectId, data = {}, sessionToken = "", abortController = new AbortController()) => {
  try {
   const _response = await _fetch(`/users/${objectId}`, "PUT", { "X-Parse-Session-Token": sessionToken }, data, abortController);
   if (_response.status !== 200) { return new AppError({ text: "parse-error", status: _response.status, message: _response.statusText }); }

    return await _response.json();
  } catch (error) {
    return new AppError({ message: error.message });
  }
};

export const retrieveParseObjects = async (className, keys = "objectId", sessionToken = "", abortController = new AbortController()) => {
  try {
    const _response = await _fetch(`/classes/${className}`, "GET", { "X-Parse-Session-Token": sessionToken }, { "keys": (Array.isArray(keys)) ? keys.join(",") : keys }, abortController);
    if (_response.status !== 200) { new AppError({ text: "parse-error", status: _response.status, message: _response.statusText }); }

    const _objects = await _response.json();
    return (_objects.hasOwnProperty("results")) ? _objects.results : [];
  } catch (error) {
    return new AppError({ message: error.message });
  }
};

export const createParseObject = async (className, data = {}, sessionToken = "", abortController = new AbortController()) => {
  try {
    const _response = await _fetch(`/classes/${className}`, "POST", { "X-Parse-Session-Token": sessionToken }, data, abortController);
    if (_response.status !== 200) { new AppError({ text: "parse-error", status: _response.status, message: _response.statusText }); }

    return await _response.json();
  } catch (error) {
    return new AppError({ message: error.message });
  }
};
