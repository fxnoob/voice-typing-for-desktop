import constants from "../../constants";
/**
 * Schema class object
 *
 * @export
 * @class Schema
 */
class Schema {
  constructor() {
    this.data = {
      client: {
        url: 'http://localhost:3000',
        publicKey: null, // client public key
      },
      isMicListening: false,
      audioAccess: false,
      alwaysOpen: false,
      emojiEnabled: true,
      closestMatchingEmoji: true,
      defaultLanguage: {
        code: "en-US",
        label: "English (United States)"
      },
      commandsConfig: constants.commands, // commands enabled/disabled list
      mountAckId: constants.contentScript.mountAckId
    };
  }
}

/**
 * Chrome storage abstraction class
 *
 * @export
 * @class Db
 */
class Db {
  /**
   * Set a value in storage
   *
   * @param {object} params  key/value pair to be saved
   * @returns {Promise}
   * @memberof Db
   */
  set(params) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(params, () => {
          resolve(params);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Get a value from storage
   *
   * @param {...*} params
   * @returns {Promise}
   * @memberof Db
   */
  get(...params) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(params, items => {
          if (items === undefined) {
            reject(new Error("Error"));
          } else {
            resolve(items);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * get all (key/value)s from storage
   *
   * @returns {Promise}
   * @memberof Db
   */
  getAll = () => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(null, items => {
          if (items === undefined) {
            reject(new Error("Error"));
          } else {
            resolve(items);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  /**
   * Removes a value from storage
   *
   * @param {(string[]|string)} keyStr Array of or single key
   * @returns {Promise}
   * @memberof Db
   */
  remove(keyStr) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.remove(keyStr, () => {
          resolve(keyStr);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
const schema = new Schema();
const db = new Db();

export { schema };
export default db;
