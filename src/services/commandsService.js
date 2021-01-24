import emojiCommand from "./commands/emoji";
import undoCommand from "./commands/undo";
import redoCommand from "./commands/redo";
import newLineCommand from "./commands/newline";
import pressEnterCommand from "./commands/press_enter";
import calculateCommand from "./commands/calculate";
import mathSymbolCommand from "./commands/math_symbol";
import mindfulnessCommand from "./commands/mindfulness";
import scrollDownCommand from "./commands/scroll_down";
import scrollUpCommand from "./commands/scroll_up";
import undoAllCommand from "./commands/undo_all";

class Commands {
  constructor() {
    this.options = {};
    this.commands = {};
  }
  setOptions(options) {
    this.options = options;
  }
  async getCommands(langId) {
    const Commands = [];
    try {
      Commands.push(await emojiCommand(langId));
      Commands.push(await undoCommand(langId));
      Commands.push(await redoCommand(langId));
      Commands.push(await newLineCommand(langId));
      Commands.push(await pressEnterCommand(langId));
      Commands.push(await calculateCommand(langId));
      Commands.push(await mathSymbolCommand(langId));
      Commands.push(await mindfulnessCommand(langId));
      Commands.push(await scrollDownCommand(langId));
      Commands.push(await scrollUpCommand(langId));
      Commands.push(await undoAllCommand(langId));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log({ e });
    }
    this.commands = Commands;

    return Commands;
  }
}
const command = new Commands();
export default command;
