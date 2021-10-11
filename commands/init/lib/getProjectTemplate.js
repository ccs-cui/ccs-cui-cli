const request = require('@cui-cli/request')

module.exports = function() {
    return new Promise(resolve => {
        request({
            url: '/api/v1/tech/bui_cli_templates/page',
            method: 'POST',
            data: {
                pageNum: 1,
                pageSize: 10000,
            },
        })
        .then(res => {
            const set = res?.data?.data ?? []
            const templates = set.map(item => {
                const template = {
                    ...item,
                    startCommand: item.start_command,
                    installCommand: item.install_command,
                    npmName: item.npm_name,
                    ignore: []
                }
                template.ignore.push(item.ignore)
                // const values = item.values ?? []
                // values?.forEach(value => {
                //     if (value.name === 'ignore') {
                //         template.ignore.push(value.value)
                //         return
                //     }
                //     template[value.name] = value.value
                // })
                return template
            })
            resolve(templates)
        })
        .catch(err => {
            throw new Error('模板接口调用失败', err)
        })
    })
}