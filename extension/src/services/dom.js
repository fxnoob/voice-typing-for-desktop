class Dom {
  constructor() {
    this.lastFocusedElementDocument = null;
    this.lastTypedWord = null;
  }
  /**
   * If the focus is in an iframe with a different origin, then attempting to
   * access focusedElem.contentDocument will fail with a `SecurityError`:
   * Failed to read the 'contentDocument' property from 'HTMLIFrameElement':
   *  - Blocked a frame with origin "http://jsbin.io" from accessing a cross-origin frame."
   * Rather than spam the console with exceptions, we'll treat this as an
   * unrenderable situation (which it is).
   * More info:
   *  - https://github.com/adam-p/markdown-here/issues/173
   *  - https://github.com/adam-p/markdown-here/issues/435
   * @param {*} focusedElem
   * @return {boolean}
   */
  iframeAccessOkay(focusedElem) {
    try {
      // eslint-disable-next-line no-unused-vars
      const _ = focusedElem.contentDocument;
    } catch (e) {
      // TODO: Check that this is actually a SecurityError
      // and re-throw if it's not?
      return false;
    }

    return true;
  }
  /**
   * @param {*} document
   * @return {*}
   */
  findFocusedElem(document, mountAckId = "ghjfgfghf") {
    this.lastFocusedElementDocument = document;
    let focusedElem = document.activeElement;

    // Tests if it's possible to access the iframe contentDocument without
    // throwing an exception.
    if (!this.iframeAccessOkay(focusedElem)) {
      return null;
    }

    // If the focus is within an iframe, we'll have to drill down to get to the
    // actual element.
    while (focusedElem && focusedElem.contentDocument) {
      const contentDoc = focusedElem.contentDocument;
      if (contentDoc.getElementById(mountAckId)) {
        return focusedElem;
      }
      focusedElem = focusedElem.contentDocument.activeElement;
      if (!this.iframeAccessOkay(focusedElem)) {
        return null;
      }
      this.lastFocusedElementDocument = focusedElem.contentDocument;
    }
    // check if current is in shadow/nested shadow dom.
    do {
      if (focusedElem.shadowRoot) {
        if (focusedElem.shadowRoot.getElementById(mountAckId)) {
          return focusedElem;
        }
        focusedElem = focusedElem.shadowRoot.activeElement;
        this.lastFocusedElementDocument = focusedElem.shadowRoot;
      }
    } while (focusedElem.shadowRoot);

    // There's a bug in Firefox/Thunderbird that we need to work around. For
    // details see https://github.com/adam-p/markdown-here/issues/31
    // In short: Sometimes we'll get the <html> element instead of <body>.
    if (focusedElem instanceof document.defaultView.HTMLHtmlElement) {
      focusedElem = focusedElem.ownerDocument.body;
      this.lastFocusedElementDocument = focusedElem.ownerDocument;
    }
    return focusedElem;
  }
  /**
   * check if current page is in iframe.
   * @return {*}
   */
  inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  static isTextInput(el) {
    /* if element is a form input element or textarea element
      and not type radio, checkbox, submit, button, color, hidden and
      not readOnly or disabled */
    if (
      el.nodeName == "TEXTAREA" ||
      el.nodeName == "INPUT" &&
        !el.type.match(
          /^(radio|checkbox|submit|reset|button|color|hidden|image)$/i
        )
    )
      if (el.disabled != true)
        // used to have el.readOnly != true &&
        return true;
      else return false;
  }
  keypress(array, el) {
    // Simulate a keypress
    var keyCode,
      ctrl,
      alt,
      shift,
      no_insertText = false;

    // array is an array: [keyCode, ctrl, alt, shift]
    if (Array.isArray(array)) {
      keyCode = array[0];
      ctrl =
        typeof array[1] != "undefined" &&
        array[1] != "0" &&
        array[1] != "false" &&
        array[1] != false
          ? true
          : false;
      alt =
        typeof array[2] != "undefined" &&
        array[2] != "0" &&
        array[2] != "false" &&
        array[2] != false
          ? true
          : false;
      shift =
        typeof array[3] != "undefined" &&
        array[3] != "0" &&
        array[3] != "false" &&
        array[3] != false
          ? true
          : false;
      no_insertText =
        typeof array[4] != "undefined" &&
        array[4] != "0" &&
        array[4] != "false" &&
        array[4] != false
          ? true
          : false;
    } else keyCode = array;
    if (isNaN(keyCode)) {
      // if keyCode is not a number
      keyCode = keyCode.charCodeAt(0); // Convert string character into charCode
    } // Version 0.99.7
    keyCode = Number(keyCode);
    var keyCodeLowerCase = keyCode;
    var key = String.fromCharCode(keyCode);
    var code = "Key" + key.toUpperCase();
    // keydown and keyup change a-z (97-122) to A-Z (65-90); keypress leaves it as lowercase
    if (keyCode >= 97 && keyCode <= 122) keyCodeLowerCase = keyCode - 32;
    var keyObj = {
      key: key,
      which: keyCodeLowerCase,
      keyCode: keyCodeLowerCase,
      charCode: 0,
      bubbles: true,
      cancelable: true,
      code: code,
      composed: true,
      isTrusted: true,
      ctrlKey: ctrl,
      altKey: alt,
      shiftKey: shift
    };
    var keypressObj = {
      key: key,
      which: keyCode,
      keyCode: keyCode,
      charCode: keyCode,
      bubbles: true,
      cancelable: true,
      code: code,
      composed: true,
      isTrusted: true,
      ctrlKey: ctrl,
      altKey: alt,
      shiftKey: shift
    };
    if (ctrl)
      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Control",
          code: "ControlLeft",
          keyCode: 17,
          ctrlKey: ctrl,
          altKey: alt,
          shiftKey: shift
        })
      );
    if (alt)
      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Alt",
          code: "AltLeft",
          keyCode: 18,
          ctrlKey: ctrl,
          altKey: alt,
          shiftKey: shift
        })
      );
    if (shift)
      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Shift",
          code: "ShiftLeft",
          keyCode: 16,
          ctrlKey: ctrl,
          altKey: alt,
          shiftKey: shift
        })
      );

    el.dispatchEvent(new KeyboardEvent("keydown", keyObj));
    el.dispatchEvent(new KeyboardEvent("keypress", keypressObj));
    //el.dispatchEvent(new InputEvent('input',{'data':key, inputType:'insertText' }));
    if (
      (el.isContentEditable || Dom.isTextInput(el)) &&
      no_insertText == false &&
      !ctrl &&
      !alt
    ) {
      var textEvent = document.createEvent("TextEvent");
      textEvent.initTextEvent(
        "textInput",
        true,
        true,
        null, key, 9, "en-US");
      el.dispatchEvent(textEvent);
      document.execCommand(
        "InsertText",
        false,
        key);
    }
    el.dispatchEvent(new KeyboardEvent("keyup", keyObj));
    if (ctrl)
      el.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Control",
          code: "ControlLeft",
          keyCode: 17,
          ctrlKey: false,
          altKey: alt,
          shiftKey: shift
        })
      );
    if (alt)
      el.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Alt",
          code: "AltLeft",
          keyCode: 18,
          ctrlKey: ctrl,
          altKey: alt,
          shiftKey: shift
        })
      );
    if (shift)
      el.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Shift",
          code: "ShiftLeft",
          keyCode: 16,
          ctrlKey: ctrl,
          altKey: alt,
          shiftKey: shift
        })
      );
  }
  simulateWordTyping(wordString, mountAckId, document = window.document) {
    this.lastTypedWord = wordString;
    const activeElement = this.findFocusedElem(document, mountAckId);
    const charArray = wordString.split("");
    charArray.map(char => {
      const charCode = new String(char).charCodeAt(0);
      this.keypress(charCode, activeElement);
    });
  }
}
const dom = new Dom();
export default dom;
