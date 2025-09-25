const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
const bareUrl = (location.protocol === "https:" ? "https" : "http") + "://" + location.host + "/bare/";

const input = document.getElementById("urlInput");
const button = document.getElementById("searchButton");
const iframe = document.getElementById("iframeWindow");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    button.click();
  }
});

button.onclick = async function (event) {
  event.preventDefault();

  let url = input.value.trim();
  if (!url) return;

  const searchUrl = "https://www.google.com/search?q=";

  if (!url.includes(".")) {
    url = searchUrl + encodeURIComponent(url);
  } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  if (!await connection.getTransport()) {
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
  }

  iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
};

document.getElementById("switcher").onchange = async function (event) {
  const value = event.target.value;
  switch (value) {
    case "epoxy":
      await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
      break;
    case "bare":
      await connection.setTransport("/baremod/index.mjs", [bareUrl]);
      break;
  }
};
