const request = require('@ccs-cli/request')

module.exports = function() {
    return new Promise(resolve => {
        resolve([
            {
                "startCommand": "pnpm start",
                "owner_org_code": "40c4751a72ea4e1b823d3b2250d31501",
                "created_at": "2024-11-05 11:08:04",
                "type": "normal",
                "system_event": "",
                "bui_cli_templates_id": "1303194094809952256",
                "version": "^0.0.7",
                "created_by": "mayefeng",
                "data_source": "crius",
                "is_deleted": false,
                "updated_at": "2024-11-26 09:55:39",
                "npmName": "@ccs-cli/cui-pro-template",
                "system_version": "1",
                "name": "Cui Pro 企业级中后台模板（完整）",
                "updated_by": "mayefeng",
                "ignore": ["**/public/favicon.ico"],
                "installCommand": "pnpm i",
                "tag": "project",
                "status": "1"
            }
        ])
        // resolve([
        //     {
        //         name: 'React build-scripts项目标准模板',
        //         npmName: '@cui/react-app-template',
        //         version: '0.0.20',
        //         type: 'normal',
        //         startCommand: 'npm run start',
        //         installCommand: 'npm i',
        //         tag: 'project',
        //         ignore: ['**/public/index.html'],
        //     }
        // ])
        // return
        // /api/gateway/metabase/api/v1/tech/bui_cli_templates/page

        // request({
        //     url: 'http://10.20.130.146:31563/api/v1/tech/bui_cli_templates/page',
        //     method: 'POST',
        //     data: {
        //         pageNum: 1,
        //         pageSize: 10000,
        //     },
        // })
        // .then(res => {
        //     const set = res?.data?.data ?? []
        //     const templates = set.filter(item => item.status === '1').map(item => {
        //         let ignore = []
        //         try {
        //             ignore = JSON.parse(item.ignore)
        //         } catch {
        //             ignore = []
        //         }
        //         const template = {
        //             ...item,
        //             startCommand: item.start_command,
        //             installCommand: item.install_command,
        //             npmName: item.npm_name,
        //             ignore,
        //         }
        //         // const values = item.values ?? []
        //         // values?.forEach(value => {
        //         //     if (value.name === 'ignore') {
        //         //         template.ignore.push(value.value)
        //         //         return
        //         //     }
        //         //     template[value.name] = value.value
        //         // })
        //         return template
        //     })
        //     resolve(templates)
        // })
        // .catch(err => {
        //     console.log(err)
        //     throw new Error('模板接口调用失败', err)
        // })
    })
}