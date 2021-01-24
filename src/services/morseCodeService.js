import en from './morse_code_files/en';
const MORSE = {};
MORSE['en'] = en;
class MorseCode {
  constructor(ac, rate) {
    // ac is an audio context.
    this.ac = ac;
    this._oscillator = ac.createOscillator();
    this._gain = ac.createGain();
    this._gain.gain.value = 0;
    this._oscillator.frequency.value = 750;
    this._oscillator.connect(this._gain);
    if (rate == undefined) rate = 20;
    this._dot = 1.2 / rate; // formula from Wikipedia.
    this._oscillator.start(0);
  }
  connect(target) {
    return this._gain.connect(target);
  }
  playChar(t, c) {
    for (var i = 0; i < c.length; i++) {
      switch (c[i]) {
      case ".":
        this._gain.gain.setValueAtTime(1.0, t);
        t += this._dot;
        this._gain.gain.setValueAtTime(0.0, t);
        break;
      case "-":
        this._gain.gain.setValueAtTime(1.0, t);
        t += 3 * this._dot;
        this._gain.gain.setValueAtTime(0.0, t);
        break;
      }
      t += this._dot;
    }
    return t;
  }
  playString(w, lang='en') {
    let t = ac.currentTime;
    w = w.toUpperCase();
    for (var i = 0; i < w.length; i++) {
      if (w[i] == " ") {
        t += 3 * this._dot; // 3 dots from before, three here, and
        // 1 from the ending letter before.
      } else if (MORSE[lang][w[i]] != undefined) {
        t = this.playChar(t, MORSE[lang][w[i]]);
        t += 2 * this._dot;
      }
    }
    return this._oscillator;
  }
}
const ac = new (window.AudioContext || window.AudioContext)();
const morse = new MorseCode(ac);
morse.connect(ac.destination);
export default morse;
