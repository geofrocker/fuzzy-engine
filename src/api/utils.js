const fs = require("fs");
const config = require("../../config");

const fetchNumbers = (limit, order, fakePath=0) => {
  try {
    const numbersString = fs.readFileSync(fakePath || config.env.path);
    let numObj = JSON.parse(numbersString);
    numObj[0].numbers = numObj[0].numbers.splice(0, limit);
    if (order === "asc") {
      numObj[0].numbers.sort((a, b) => a - b);
      return numObj;
    } else if (order === "desc") {
      numObj[0].numbers.sort((a, b) => b - a);
      return numObj;
    } else {
      return numObj;
    }
  } catch (e) {
    return [];
  }
};

module.exports = {
  fetchNumbers: fetchNumbers
};
