const {
    bodySelecor,
    selPostTExt
} = require('../parse/selectors')

const publishPost = ({
    post,
    _nightmare,
    topic
}) => {
    return new Promise((res, rej) => {
        try {
            res(_nightmare
                .goto(topic)
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


module.exports = publishPost