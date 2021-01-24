import translationService from "../translationService";

export default async langId => {
  const commandAlias = "Press Enter";
  const description = await translationService.getMessage(
    langId,
    "command_press_enter_description"
  );
  return {
    id: '2C813AB6-109C-7BBE-50A5-B54CE1C30BD8',
    name: commandAlias,
    description: description,
    match: "exact",
    exec: async (text, options, callback) => {
      const { dom } = options;
      dom.pressEnter();
      callback();
    }
  };
};
