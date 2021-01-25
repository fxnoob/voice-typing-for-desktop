/* eslint-disable no-unused-vars */
import * as math from 'mathjs';

export default async (langId) => {
  const commandAlias = 'calculate';
  const description = 'say `calculate five times 15` to calculate 5 * 15';
  return {
    id: '20850A52-2A46-42A2-BED5-35F9E9B55344',
    name: commandAlias,
    description,
    match: 'startsWith',
    exec: async (text, options, callback) => {
      const symbols = {
        x: '*',
        multiplies: '*',
        multiply: '*',
        times: '*',
        plus: '+',
        minus: '-',
        divides: '/',
        divide: '/',
        'divides by': '/',
        'divide by': '/',
        inches: 'inch',
        centimeter: 'cm',
        centimeters: 'cm',
        degree: 'deg',
      };
      let commandContent = text.replace(commandAlias, '').toLowerCase().trim();
      Object.keys(symbols).map((key) => {
        commandContent = commandContent.replace(key, symbols[key]);
      });
      const { dom, ackId } = options;
      try {
        const res = math.evaluate(commandContent);
        dom.simulateWordTyping(` ${res}`, ackId);
      } catch (e) {
        dom.simulateWordTyping(` ${text}`, ackId);
      }
    },
  };
};
