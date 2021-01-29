import openSocket from 'socket.io-client';

// @ts-ignore
const socket = openSocket('http://localhost:3000');
function toggleSR() {
  return {
    listen: (cb: (arg0: any) => any) =>
      socket.on('toggle_sr', (data: any) => cb(data)),
    emit: (data: any) => socket.emit('toggle_sr', data),
  };
}

function callbackSR() {
  return {
    listen: (cb: (arg0: any) => any) =>
      socket.on('callback_sr', (value: any) => cb(value)),
    emit: (value: any) => socket.emit('callback_sr', value),
  };
}

function changeLanguageSR() {
  return {
    listen: (cb: (arg0: any) => any) =>
      socket.on('change_language_sr', (value: any) => cb(value)),
    emit: (value: any) => socket.emit('change_language_sr', value),
  };
}

function checkConnectionSR() {
  return {
    listen: (cb: (arg0: any) => any) =>
      socket.on('check_connection_sr', (value: any) => cb(value)),
    emit: (value: any) => socket.emit('check_connection_sr', value),
  };
}

// @ts-ignore
export { toggleSR, callbackSR, changeLanguageSR, checkConnectionSR };
