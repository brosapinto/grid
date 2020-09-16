function request(url, options = {}) {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
    ...options,
  }).then((resp) => {
    const body = resp.json();
    const hasError = resp.status < 200 || resp.status >= 300;

    return hasError ? body.then(Promise.reject.bind(Promise)) : body;
  });
}

export const get = request;

export function post(url, data, options = {}) {
  return request(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
}
