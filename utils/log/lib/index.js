/*
 * @Author: mayefeng
 * @Date: 2023-06-29 13:10:18
 * @LastEditors: mayefeng
 * @LastEditTime: 2023-07-14 14:24:12
 * @FilePath: /ccs-cui-cli/utils/log/lib/index.js
 * @Description: Description here
 */
'use strict';

const log = require('npmlog')

log.level = process.env.LOG_LEVEL || 'info' // 判断bug模式 
log.heading = 'cui' // 修改前缀
// log.headingStyle = { fg: 'red', bg: 'white' }
log.addLevel('success', 2000, { fg: 'green', bold: true }) //新增自定义命令

module.exports = log;
