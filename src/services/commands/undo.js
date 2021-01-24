import translationService from "../translationService";

export default async langId => {
  const commandAlias = await translationService.getMessage(
    langId,
    "label_undo"
  );
  const description = await translationService.getMessage(
    langId,
    "command_undo_description"
  );
  return {
    id: '9703B37A-11D7-BAB8-3FE9-E70D637BB49A',
    name: commandAlias,
    description: description,
    match: "exact",
    exec: async (text, options, callback) => {
      const { dom } = options;
      try {
        dom.undo();
        callback();
      } catch (e) {
        // eslint-disable-next-line
        console.log(e);
      }
    }
  };
};
