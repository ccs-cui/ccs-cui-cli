'use strict';

const log = require('npmlog')

log.level = process.env.LOG_LEVEL || 'info' // 判断bug模式 
log.heading = 'boulderai' // 修改前缀
// log.headingStyle = { fg: 'red', bg: 'white' }
log.addLevel('success', 2000, { fg: 'green', bold: true }) //新增自定义命令

module.exports = log;
