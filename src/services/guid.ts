const guid: any = {};
guid.generateGuid = () => {
  let result;
  let i;
  let j;
  result = '';
  for (j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result += '-';
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result += i;
  }
  return result;
};

module.exports = guid;
