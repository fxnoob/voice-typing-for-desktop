import db from "./services/db";
import MessagePassing from "./services/messagePassing";
import {
  toggleSR,
  callbackSR,
  changeLanguageSR,
  checkConnectionSR
} from "./services/socketClient";

const socketRoutes = async (voice) => {
  const { listen: listenToggleSR, emit: emitToggleSR } = toggleSR();
  listenToggleSR(async data => {
    console.log("listenToggleSR called ", data);
    await MessagePassing.exec('/toggle_sr')
    const { defaultLanguage, isMicListening } = await db.get(
      "defaultLanguage",
      "client",
      "isMicListening"
    );
    emitToggleSR({
      value: data.value,
      listening: isMicListening,
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
    const {state} = voice.permissionGranted();
    if (state == 'granted') {
      checkConnectionEmit({ connected: true, permissionGranted: true });
    } else {
      checkConnectionEmit({ connected: true, permissionGranted: false });
    }
  });
};

const Routes = async (voice) => {
  socketRoutes(voice);
  const { emit: emitCallbackSR } = callbackSR();
  voice.addCommand({
    "*text": async text => {
      console.log("callbackSR", text);
      const { defaultLanguage, client } = await db.get(
        "defaultLanguage",
        "client"
      );
      //const key = new NodeRSA();
      //key.importKey(client.publicKey, "openssh-pem-public");
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
      console.log({defaultLanguage});
      voice.setLanguage(defaultLanguage.code);
      voice.start();
    }
    await db.set({ isMicListening: !isMicListening });
    //res({ isMicListening: !isMicListening });
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
