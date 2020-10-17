// const bodySelecor = 'body';
// const tSelector = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr > td.back4 > table > tbody > tr:nth-child(2) > td > p:nth-child(2) > table';
const pefl = 'http://pefl.ru/';
const url = pefl + 'index.php';

const pefl_auth = pefl + 'auth.php';
// const selPeflLogin = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr > td.back4 > table > tbody > tr:nth-child(2) > td > form > input[type=text]:nth-child(1)';
// const selPeflPassword = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr > td.back4 > table > tbody > tr:nth-child(2) > td > form > input[type=password]:nth-child(2)';
// const selIndexNews = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr > td.back4 > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > a:nth-child(2)';
// const schoolTable = '#rt';



module.exports = {
    bodySelecor: 'body',
    tSelector: 'td.back4 > table > tbody > tr:nth-child(2) > td > p:nth-child(2) > table',
    pefl: pefl,
    url: url,
    pefl_auth: pefl_auth,
    selPeflLogin: 'td.back4 > table > tbody > tr:nth-child(2) > td > form > input[type=text]:nth-child(1)',
    selPeflPassword: 'td.back4 > table > tbody > tr:nth-child(2) > td > form > input[type=password]:nth-child(2)',
    selIndexNews: 'td.back4 > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > a:nth-child(2)',
    schoolTable: '#rt',
    tournamentsPageRef: 'http://pefl.ru/plug.php?p=refl&z=48c617d600c4110a664d80c8d852d463',
    cupRounds: 'td.back4 tr:nth-child(2) > td > table',
    selID: 'td:nth-child(2) > table:nth-child(2) td:nth-child(3)',
    selOpposites : 'td:nth-child(1)',
    selGames : 'td:nth-child(2)',
    selTv : 'td:nth-child(3)',
    roundGames : 'td.back4 p:nth-child(3) > table',
    
}