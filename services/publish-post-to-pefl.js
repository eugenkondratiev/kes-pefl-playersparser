// const _nightmare = require('../parse/pefl-auth');

const { selDbErrorsTopic, bodySelecor, selPostTExt } = require('../parse/selectors')
const nightmare = require('../parse/pefl-auth')();

const publishPost = (post, _nightmare) => {
return new Promise((res,rej)=>{
    console.log("=====================================");
    console.log("publish post to pefl");
    try {
        res(_nightmare
            .goto(selDbErrorsTopic)
            .wait(1000)
            .wait(bodySelecor)
            .insert(selPostTExt, post)
            .wait(10000)
            .click('input[type=submit]')
            .wait(1000)
        )
    } catch (error) {
        console.log('publish post to pefl error :>> ', error);
        rej(error.message)
    }
})

    
}
// setTimeout(()=>{
//     publishPost("Test !!", nightmare);
//     ;
// }, 3000)

module.exports = publishPost