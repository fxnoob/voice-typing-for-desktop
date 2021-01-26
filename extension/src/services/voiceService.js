import * as SR from "annyang";
import chromeService from "./chromeService";
import languages from "./languages";
class Voice {
  constructor() {
    this.supportedLanguages = languages;
    this.SR = SR;
  }
  addCommand(commands) {
    this.SR.addCommands(commands);
  }
  start() {
    chromeService.setBadgeOnActionIcon("◉");
    chromeService.setBadgeColorOnActionIcon("#f50057");
    console.log(this.permissionGranted());
    this.SR.start();
  }
  stop() {
    chromeService.setBadgeOnActionIcon("");
    this.SR.abort();
  }
  setLanguage(langKey = "en-US") {
    this.SR.setLanguage(langKey);
  }
  permissionGranted() {
    return navigator.permissions.query({ name: "microphone" });
  }
  speak(text, options) {
    chrome.tts.speak(text, options); // options : {lang: lang_key}
  }
}

const voice = new Voice();
export default voice;
