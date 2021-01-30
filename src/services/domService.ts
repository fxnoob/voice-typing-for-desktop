import * as robot from 'robotjs';

class DomService {
  private deleted: any[];

  private stack: any[];

  constructor() {
    this.stack = [];
    this.deleted = [];
  }

  // @ts-ignore
  simulateWordTyping = (str: string, ack: any) => {
    robot.typeString(str);
    this.stack.push(str);
  };

  undo = () => {
    if (this.stack.length == 0) return;
    const str = this.stack.pop();
    for (let i = 0; i < str.length; i++) {
      robot.keyTap('backspace');
    }
    this.deleted.push(str);
  };

  undoAll = () => {
    if (this.stack.length == 0) return;
    const len = this.stack.length;
    for (let i = 0; i < len; i++) {
      this.undo();
    }
  };

  redo = () => {
    if (this.deleted.length == 0) return;
    const str = this.deleted.pop();
    // @ts-ignore
    this.simulateWordTyping(str);
  };

  scroll = (direction = 'down') => {
    if (direction == 'up') {
      robot.scrollMouse(50, 0);
    } else {
      robot.scrollMouse(50, 0);
    }
  };

  pressEnter = () => {
    robot.keyTap('enter');
  };
}
const dom = new DomService();
// @ts-ignore
export default dom;
