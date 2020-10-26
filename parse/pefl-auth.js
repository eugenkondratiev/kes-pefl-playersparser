const Nightmare = require('nightmare');

const nightmare = Nightmare({ show: false });
const pefl_auth = 'http://pefl.ru/auth.php';
const selPeflLogin = 'td.back4 tr:nth-child(2) input[type=text]:nth-child(1)';
const selPeflPassword = 'td.back4 tr:nth-child(2) input[type=password]:nth-child(2)';
const selIndexNews ='td.back4 > table > tbody span.text2b';

const login = require('./pefl-login');

let loggedPefl;
function logToPefl(){
  return nightmare
  .goto(pefl_auth)
  .wait('body')
  .insert(selPeflLogin, login.login)
  .insert(selPeflPassword, login.password)
  .click('input[type=submit]')
  .wait(2000)
  .wait(selIndexNews);

}
module.exports = function () {
  if (loggedPefl) {
  console.log("return used loggedPefl");
    return loggedPefl;
  }
  console.log("!!!New  log to Pefl");
  loggedPefl = logToPefl();
  return loggedPefl;
}