const fs = require("fs");
const jsonfile = require("jsonfile");
const path = require("path");
const { translate, locales } = require("./translate");

const locale_en = jsonfile.readFileSync(path.join(__dirname, "locale_en.json"));

const target_dir_root = path.join(__dirname, "../src/app/_locales");

function sleep(miliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("");
    }, miliseconds);
  });
}

function createDirIfNotExist(dirname) {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
}

async function translateLocaleJsonToFile(targetEn, json) {
  console.log(json);
  const jsonObj = {};
  console.log("------translating locales for -> ", targetEn, "------------");
  const keys = Object.keys(json);
  for (let i = 0; i < keys.length; i++) {
    try {
      const message = json[keys[i]].message;
      const result = await translate("en", targetEn, message);
      console.log(
        targetEn,
        " ->  ",
        json[keys[i]].message,
        "   ->  ",
        result.translation
      );
      jsonObj[keys[i]] = {};
      jsonObj[keys[i]].message = result.translation;
      jsonObj[keys[i]].description = json[keys[i]].description;
    } catch (e) {
      console.log(e);
    }
  }
  createDirIfNotExist(path.join(target_dir_root, `/${targetEn}`));
  jsonfile.writeFileSync(
    path.join(target_dir_root, `/${targetEn}/messages.json`),
    jsonObj,
    { flag: "w" }
  );
}

async function init() {
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    await translateLocaleJsonToFile(locale, locale_en);
    await sleep(3000);
  }
}

/**
 *
 * takes updated locale_en.json
 * updates json content in ../src/app/_locales/${locale}/messages.json
 *
 * */
async function appendToLocales() {
  const updatedLocaleEn = jsonfile.readFileSync(
    path.join(__dirname, "locale_en.json")
  );
  const newKeys = Object.keys(updatedLocaleEn);
  const targetDirRoot = path.join(__dirname, "../src/app/_locales");
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    const oldJsonFilePath = path.join(
      targetDirRoot,
      `/${locale}/messages.json`
    );
    const oldJsonFile = jsonfile.readFileSync(oldJsonFilePath);
    for (let j = 0; j < newKeys.length; j++) {
      const newKey = newKeys[j];
      if (!oldJsonFile[newKey]) {
        const message = updatedLocaleEn[newKey].message;
        const { translation } = await translate("en", locale, message);
        oldJsonFile[newKey] = {
          message: translation,
          description: updatedLocaleEn[newKey].description
        };
        console.log("updating key ->", newKey, "  ->  ", oldJsonFile[newKey]);
      } else {
        console.log("key already available ->", newKey);
      }
    }
    jsonfile.writeFileSync(oldJsonFilePath, oldJsonFile, { flag: "w" });
  }
}
appendToLocales();
