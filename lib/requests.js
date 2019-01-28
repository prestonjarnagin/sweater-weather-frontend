
export function sendRequest(method, path, body){
  function sendRequest(method, path, body){
    return fetch(`${SERVER_PATH}${path}`, {
      method: method,
      headers: {'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
  }

};
