const jwtLib = require('jsonwebtoken');

const snakeToPascal = (string) => string
  .toLowerCase()
  .split('_')
  .map((el) => el.charAt(0).toUpperCase() + el.slice(1)).join('');

const jwt = {
  sign: jwtLib.sign,
  decode: jwtLib.decode,
  verify: (token, secret) => new Promise((res) => {
    jwtLib.verify(token, secret, (err, decoded) => res([err, decoded]));
  }),
};


function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


module.exports = { snakeToPascal, jwt, formatDate,} ;
