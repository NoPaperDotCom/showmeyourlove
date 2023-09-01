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
