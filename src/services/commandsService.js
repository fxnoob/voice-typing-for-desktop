import emojiCommand from './commands/emoji';
import undoCommand from './commands/undo';
import redoCommand from './commands/redo';
import newLineCommand from './commands/newline';
import pressEnterCommand from './commands/press_enter';
import calculateCommand from './commands/calculate';
import mathSymbolCommand from './commands/math_symbol';
import mindfulnessCommand from './commands/mindfulness';
import scrollDownCommand from './commands/scroll_down';
import scrollUpCommand from './commands/scroll_up';
import undoAllCommand from './commands/undo_all';

class Commands {
  constructor() {
    this.options = {};
    this.commands = {};
  }

  setOptions(options) {
    this.options = options;
  }

  async getCommands(langId) {
    const cmd = [];
    try {
      cmd.push(await emojiCommand(langId));
      cmd.push(await undoCommand(langId));
      cmd.push(await redoCommand(langId));
      cmd.push(await newLineCommand(langId));
      cmd.push(await pressEnterCommand(langId));
      cmd.push(await calculateCommand(langId));
      cmd.push(await mathSymbolCommand(langId));
      cmd.push(await mindfulnessCommand(langId));
      cmd.push(await scrollDownCommand(langId));
      cmd.push(await scrollUpCommand(langId));
      cmd.push(await undoAllCommand(langId));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log({ e });
    }
    this.commands = cmd;

    return cmd;
  }
}
const command = new Commands();
export default command;
