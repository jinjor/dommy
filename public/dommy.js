(function() {
  function decodeInput(input) {
    const id = input.getAttribute("id");
    const name = input.getAttribute("name");
    const type = input.getAttribute("type");
    let value = input.value;
    if (type == "number") {
      value = +value;
    }
    return { id, name, value };
  }
  function decodeForm(form) {
    const object = {};
    const inputs = form.querySelectorAll("*[name]");
    for (let input of inputs) {
      const { name, value } = decodeInput(input);
      object[name] = value;
    }
    return object;
  }
  function send(url, options) {
    return fetch(url, options).then(e => {
      if (e.status >= 400) {
        return Promise.reject(e);
      } else {
        return e.json();
      }
    });
  }
  function loadStorage(form) {
    const inputs = form.querySelectorAll("*[name]");
    for (let input of inputs) {
      const { id } = decodeInput(input);
      const value = JSON.parse(localStorage.getItem(id));
      input.value = value;
    }
  }
  function syncStorage(e) {
    const target = e.target;
    const { id, value } = decodeInput(target);
    localStorage.setItem(id, JSON.stringify(value));
  }
  function handleSubmit(method, e) {
    e.preventDefault();
    const object = decodeForm(form);
    const url = form.getAttribute("action");

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    const body = JSON.stringify(object);
    const id = form.getAttribute("id");
    send(url, {
      method,
      headers,
      body
    })
      .then(json => {
        window.events[id](json);
      })
      .catch(e => {
        window.events[id + "_error"](e);
      });
  }
  const forms = document.querySelectorAll("form");
  for (let form of forms) {
    const method = form.getAttribute("method");
    if (method === "POST") {
      loadStorage(form);
      form.addEventListener("input", syncStorage);
    }
    form.addEventListener("submit", e => handleSubmit(method, e));
  }
})();
