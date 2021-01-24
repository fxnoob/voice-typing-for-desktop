import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:3000");
function toggleSR() {
  return {
    listen: cb => socket.on("toggle_sr", data => cb(data)),
    emit: data => socket.emit("toggle_sr", data)
  };
}

function callbackSR() {
  return {
    listen: cb => socket.on("callback_sr", value => cb(value)),
    emit: value => socket.emit("callback_sr", value)
  };
}

function changeLanguageSR() {
  return {
    listen: cb => socket.on("change_language_sr", value => cb(value)),
    emit: value => socket.emit("change_language_sr", value)
  };
}

function checkConnectionSR() {
  return {
    listen: cb => socket.on("check_connection_sr", value => cb(value)),
    emit: value => socket.emit("check_connection_sr", value)
  };
}

export { toggleSR, callbackSR, changeLanguageSR, checkConnectionSR };
