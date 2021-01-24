const fs = require("fs");
const jsonfile = require("jsonfile");
const path = require("path");
const { translate, locales } = require("./translate");
const emojiJson = jsonfile.readFileSync(path.join(__dirname, "emoji.json"));

/* a function for escaping user input to be treated as
    a literal string within a regular expression */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* function to find and replace specified term with replacement string */
function replaceAll(str, term, replacement) {
  return str.replace(new RegExp(escapeRegExp(term), "g"), replacement);
}

/**
 *
 * create directory if does not exist
 *
 */
function createDirIfNotExist(dirname) {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
}
/**
 *
 * create a commands.json file to create transforms from emojis and texts
 *
 */
function createEmojiCommandsJson() {
  /**
   *
   *  commands['command']  = {
   *    replacement: '', public: true, description: ''
   *  }
   *
   * */
  const commands = {};
  emojiJson.map(emoji => {
    const alias = emoji.aliases[0];
    commands[replaceAll(alias, "_", " ")] = {
      replacement: emoji.emoji,
      description: emoji.description
    };
  });
  jsonfile.writeFileSync(path.join(__dirname, "emoji_en.json"), commands, {
    flag: "w"
  });
}

/**
 *
 * takes updated emoji_en.json
 * updates emoji file content in ../src/services/emoji_files/${locale}.json
 *
 * */
async function generateEmojiFiles() {
  const emojiJson = jsonfile.readFileSync(
    path.join(__dirname, "emoji_en.json")
  );
  const newKeys = Object.keys(emojiJson);
  const targetDirRoot = path.join(__dirname, "../src/services/emoji_files");
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    const newEmojiFilePath = path.join(targetDirRoot, `${locale}.json`);
    const newEmojiFileContent = {};
    console.log("------generating for locale  ", locale, "----------");
    for (let j = 0; j < newKeys.length; j++) {
      const newKey = newKeys[j];
      const message = newKey;
      const { translation } = await translate("en", locale, message);
      newEmojiFileContent[translation] = {
        replacement: emojiJson[newKey].replacement,
        description: emojiJson[newKey].description
      };
      console.log(
        locale,
        "  updating ->  ",
        newKey,
        "  ->  ",
        translation,
        "  +  ",
        newEmojiFileContent[translation]
      );
    }
    jsonfile.writeFileSync(newEmojiFilePath, newEmojiFileContent, {
      flag: "w"
    });
  }
}
generateEmojiFiles();
