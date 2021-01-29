// @ts-ignore
import * as storage from 'electron-json-storage';
import constants from '../../constants';

/**
 * Schema class object
 *
 * @export
 * @class Schema
 */
class Schema {
  constructor() {
    // @ts-ignore
    this.data = {
      isMicListening: false,
      audioAccess: false,
      alwaysOpen: false,
      emojiEnabled: true,
      closestMatchingEmoji: true,
      defaultLanguage: {
        code: 'en-US',
        label: 'English (United States)',
      },
      commandsConfig: constants.commands,
      publicKey: '',
      privateKey: '',
    };
  }
}

/**
 * Chrome storage abstraction class
 *
 * @export
 * @class DbService
 */
class DbService {
  /**
   * Set a value in storage
   *
   * @param key string value
   * @returns {Promise}
   * @memberof DbService
   */
  has = (key: any): Promise<any> =>
    new Promise((resolve, reject) => {
      try {
        storage.has(key, (err: any, hasKey: any) => {
          if (err) reject(err);
          else resolve(hasKey);
        });
      } catch (e) {
        reject(e);
      }
    });

  /**
   * Set a value in storage
   *
   * @param key string value
   * @param json string value
   * @returns {Promise}
   * @memberof DbService
   */
  set = (key: any, json: any): Promise<any> =>
    new Promise((resolve, reject) => {
      try {
        storage.set(key, json, (err: any) => {
          if (err) reject(err);
          else resolve(json);
        });
      } catch (e) {
        reject(e);
      }
    });

  /**
   * Get a value from storage
   *
   * @param {...*} params
   * @returns {Promise}
   * @memberof DbService
   */
  get = (...params: any[]): Promise<any> =>
    new Promise((resolve, reject) => {
      try {
        storage.getMany(params, (err: any, items: any) => {
          if (err) reject(err);
          else if (items === undefined) {
            reject(new Error('Error'));
          } else {
            resolve(items);
          }
        });
      } catch (e) {
        reject(e);
      }
    });

  /**
   * get all (key/value)s from storage
   *
   * @returns {Promise}
   * @memberof DbService
   */
  getAll = () => {
    return new Promise((resolve, reject) => {
      try {
        storage.getAll((err: string | undefined, items: unknown) => {
          if (err) {
            reject(new Error(err));
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
   * @memberof DbService
   */
  remove = (keyStr: string[] | string): Promise<any> =>
    new Promise((resolve, reject) => {
      try {
        storage.remove(keyStr, (err: any) => {
          if (err) reject(err);
          resolve(keyStr);
        });
      } catch (e) {
        reject(e);
      }
    });
}
const schema = new Schema();
const db = new DbService();

export { schema };
// @ts-ignore
export default db;
