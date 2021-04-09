const ParseGroup = require('../parse/parse-group')
const { pefl } = require('../parse/selectors')
const fs = require('fs');

module.exports = (_nightmare, groups) => {

    return new Promise((res, rej) => {
        groups.reduce(function (acc, gr, index, arr) {
            return acc.then(function (rlt) {
                const groupUrl = pefl + gr.ref;
                const groupName = gr.name.trim();
                // console.log("----------- ", index, groupName, groupUrl);
                return ParseGroup(_nightmare, groupUrl, groupName)
                    .then(results => {
                        fs.writeFile("data/groups/__groupec-" + results.name + ".json",
                            JSON.stringify(results, null, " "),
                            async err => {
                                if (err) {
                                    console.log("###  fs.writeFile  update-groups error - ", err);
                                } else {
                                    await require('./update-databases')(results)

                                }
                            }
                        );
                        return rlt.concat([]);
                    })
                    .catch(err => { if (err) console.log("----parseFroup error", err) })
            });
        }, Promise.resolve([])
        ).then((rlt) => {
            ;
            console.log("===========GROUPS==END================");
            res(rlt)
        })
            .catch((err) => {
                if (err) console.error;
                rej(err)
            });;
    })
}
