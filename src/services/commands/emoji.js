import translationService from "../translationService";
import emoji from "../emojiService";

export default async langId => {
  const commandAlias = await translationService.getMessage(langId, "emoji");
  const description = await translationService.getMessage(
    langId,
    "command_emoji_description"
  );
  return {
    id: '4DBE9DD0-E8A2-225B-6F61-DD00381B528D',
    name: commandAlias,
    description: description,
    match: "startsWith",
    exec: async (text, options, callback) => {
      const { dom, ackId } = options;
      let alertText;
      const emojiText = text.replace(commandAlias, "").trim();
      const emojiContent = await emoji.getSomeWHatSimilarEmoji(
        langId,
        emojiText.toLowerCase()
      );
      if (emojiContent) {
        dom.simulateWordTyping(` ${emojiContent.replacement} `, ackId);
      }
      alertText = emojiContent
        ? `${commandAlias}:  ${emojiContent.replacement}`
        : await translationService.getMessage(langId, "emoji_not_found") +
          " :" +
          emojiText;
      callback(alertText);
    }
  };
};
