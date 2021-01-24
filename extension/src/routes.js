import db from "./services/db";
import MessagePassing from "./services/messagePassing";
import voice from "./services/voiceService";
const NodeRSA = require("node-rsa");
import {
  toggleSR,
  callbackSR,
  changeLanguageSR,
  checkConnectionSR
} from "./services/socketClient";

const socketRoutes = async () => {
  const changeSRto = async () => {
    const { isMicListening } = await db.get("isMicListening");
    if (isMicListening) {
      voice.stop();
    } else {
      const { defaultLanguage } = await db.get("defaultLanguage");
      voice.setLanguage(defaultLanguage.code);
      voice.start();
    }
    await db.set({ isMicListening: !isMicListening });
    return !isMicListening;
  };
  const { listen: listenToggleSR, emit: emitToggleSR } = toggleSR();
  listenToggleSR(async data => {
    console.log("listenToggleSR called ", data);
    await changeSRto();
    const { defaultLanguage, client } = await db.get(
      "defaultLanguage",
      "client"
    );
    emitToggleSR({
      value: data.value,
      langId: defaultLanguage.code,
      langLabel: defaultLanguage.label
    });
  });
  const {
    listen: languageChangeListen,
    emit: languageChangeEmit
  } = changeLanguageSR();
  languageChangeListen(async data => {
    try {
      const { client, isMicListening } = await db.get(
        "defaultLanguage",
        "client"
      );
      await db.set({
        defaultLanguage: {
          code: data.value.langId,
          label: data.value.label
        }
      });
      if (isMicListening) {
        await MessagePassing.exec("/restart_sr");
      }
    } catch (e) {}
    languageChangeEmit(data.value);
  });
  const {
    listen: checkConnectionListen,
    emit: checkConnectionEmit
  } = checkConnectionSR();
  checkConnectionListen(async () => {
    if (voice.permissionGranted()) {
      checkConnectionEmit({ connected: true, permissionGranted: true });
    } else {
      checkConnectionEmit({ connected: true, permissionGranted: false });
    }
  });
};

const Routes = async () => {
  socketRoutes();
  const { emit: emitCallbackSR } = callbackSR();
  voice.addCommand({
    "*text": async text => {
      const { defaultLanguage, client } = await db.get(
        "defaultLanguage",
        "client"
      );
      const key = new NodeRSA();
      key.importKey(client.publicKey, "openssh-pem-public");
      // const payload = {
      //   text: key.encrypt(text, 'base64'),
      //   langId: defaultLanguage.code
      // };
      emitCallbackSR({ langId: defaultLanguage.code, text });
    }
  });
  // save selected text in storage instead writing it to clipboard
  MessagePassing.on("/set_selected_text", async req => {
    const { data } = req;
    await db.set({ data: data });
  });
  //retrieve stored data
  MessagePassing.on("/get_data", async (req, res) => {
    const data = await db.get("data");
    res(data);
  });
  //send speech recognition data
  MessagePassing.on("/start_speech_recognition", async () => {
    const { state } = await voice.permissionGranted();
    if (state == "granted") {
      const { defaultLanguage } = await db.get("defaultLanguage");
      voice.setLanguage(defaultLanguage.code);
      voice.start();
    } else {
      // send to help page
    }
  });
  //stop speech recognition
  MessagePassing.on("/stop_speech_recognition", async () => {
    voice.stop();
  });
  //toggle speech recognition
  MessagePassing.on("/toggle_sr", async (req, res) => {
    const { isMicListening } = await db.get("isMicListening");
    if (isMicListening) {
      voice.stop();
    } else {
      const { defaultLanguage } = await db.get("defaultLanguage");
      voice.setLanguage(defaultLanguage.code);
      voice.start();
    }
    await db.set({ isMicListening: !isMicListening });
    res({ isMicListening: !isMicListening });
  });
  //restart speech recognition
  MessagePassing.on("/restart_sr", async () => {
    const { defaultLanguage, isMicListening } = await db.get(
      "defaultLanguage",
      "isMicListening"
    );
    if (isMicListening) {
      voice.stop();
      voice.setLanguage(defaultLanguage.code);
      voice.start();
    }
  });
  //speak sr sound
  MessagePassing.on("/speak_sr", async req => {
    const { text } = req;
    const { defaultLanguage } = await db.get("defaultLanguage");
    voice.speak(text, { lang: defaultLanguage.code });
  });
};

export default Routes;
