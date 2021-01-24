import "@babel/polyfill";
import db, { schema } from "./services/db";
import Routes from "./routes";
import chromeService from './services/chromeService';

class Main {
  constructor() {
    this.init();
  }
  /**
   * init method
   *
   * @method
   * @memberof Main
   */
  init = async () => {
    await this.initDb();
    await Routes();
    this.popUpClickSetup();
  };
  /**
   * initialize db settings
   *
   * @method
   * @memberof Main
   */
  initDb = async () => {
    const res = await db.get("loaded");
    if (!res.hasOwnProperty("loaded")) {
      await db.set({ loaded: true, ...schema.data });
    }
  };
  /**
   * callback for popup click
   *
   * @method
   * @memberof Main
   */
  popUpClickSetup() {
    chrome.browserAction.onClicked.addListener(() => {
      chromeService.openHelpPage('');
    });
  }
}

new Main();
