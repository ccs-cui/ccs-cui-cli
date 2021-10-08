const request = require('@boulderai-cli/request')

module.exports = function() {
    return request({
        url: '/project/template',
    })
}