module.exports = function (_url) {
    const jimUrl = _url;
    const nightmare = Nightmare({
        show: false
    });
    console.log("=================lets log on pefl and download players arh");
    return new Promise(function (resolve, reject) {
        nightmare
            .goto(pefl_auth)
            .wait('body')
            .insert(selPeflLogin, login.login)
            .insert(selPeflPassword, login.password)
            .click('input[type=submit]')
            // .wait(selILoginForm)
            .wait(5000)
            .wait(selIndexNews)
            .evaluate(function ev() {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", 'http://pefl.ru/desmond_jim.php', false);
                xhr.overrideMimeType("application/octetstream; charset=x-user-defined");
                xhr.send();
                return xhr.responseText;
            })
            .end()
            .then((results) => {
                console.log("jimUrl = ", jimUrl);
                const fs = require("fs");
                fs.writeFile("desmond_jim.zip", results, "binary", (err) => {
                    if (err) console.log("writeFile err", err);
                    nightmare.end();
                    resolve(results);
                })
            })
            .catch(err => {
                console.log("GetPlayersBase - ", err);
                nightmare.end();
                reject(err);
            });;
    });
}