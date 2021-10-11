'use strict';

module.exports = core;

const path = require('path')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const commander = require('commander')
const log = require('@cui-cli/log')
// const init = require('@cui-cli/init')
const exec = require('@cui-cli/exec')

const pkg = require('../package.json');
const constant = require('./const');

let args, config;

// 实例化一个脚手架的对象
const program = new commander.Command()

async function core() {
    try {
    await prepare()
    regiserCommand()
    } catch (e) {
        log.error(e.message)
        // if (process.env.LOG_LEVEL === 'verbose') {
        if (program.debug) {
            console.log(e)
        }
    }
}

function regiserCommand() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否开启调试模式', false)
        .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')

    program
        .command('init [projectName]')
        .option('-f, --force', '是否强制初始化项目')
        .action(exec)

    program
        .command('publish')
        .option('--refreshServer', '强制更新远程的Git仓库')
        .option('--refreshToken', '强制更新远程仓库token')
        .option('--refreshOwner', '强制更新远程仓库类型')
        .option('--buildCmd <buildCmd>', '构建命令')
        .option('--prod', '是否正式发布')
        .option('--sshUser <sshUser>', '模板服务器用户名')
        .option('--sshIp <sspIp>', '模板服务器或域名')
        .option('--sshPath <sshPath>', '模板服务器上传路径')
        .action(exec)

    // 开启debug模式的监听
    program.on('option:debug', () => {
        // console.log(program.debug)
        if (program.debug) {
            process.env.LOG_LEVEL = 'verbose'
        } else {
            process.env.LOG_LEVEL = 'info'
        }
        log.level = process.env.LOG_LEVEL
    })

    // 指定targetPath
    // 监听可以在业务逻辑之前执行
    program.on('option:targetPath', () => {
        process.env.CLI_TARGET_PATH = program.targetPath
    })
    
    // 对未知命令的监听
    program.on('command:*', (obj) => {
        const availableCommands = program.commands.map(cmd => cmd.name())
        console.log(colors.red(`未知的命令${obj[0]}`))
        if (availableCommands.length > 0) {
            console.log(colors.red(`可用的命令${availableCommands.join(',')}`))
        }
    })

    program.parse(process.argv)

    if (program.args && program.args.length < 1) {
        program.outputHelp()
    }
}

async function prepare() {
    checkPkgVersion()
    // checkNodeVersion() 被下沉到Command
    checkRoot()
    checkUserHome()
    // checkInputArgs()
    checkEnv()
    await checkGlobalUpdate()
    // log.verbose('debug', 'test debug log')
}

async function checkGlobalUpdate() {
    // 1.获取当前版本号和模块名
    const currentVersion = pkg.version;
    const npmName = pkg.name
    // 2、调用npm API，获取所有版本号
    const { getNpmSemverVersion } = require('@cui-cli/get-npm-info')
    const lastVersion = await getNpmSemverVersion(currentVersion, npmName)
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        // log.warn('更新提示', colors.yellow(`
        // 请手动更新 ${npmName}， 当前版本：${currentVersion}，最新版本${lastVersion}
        // 更新命令：npm install -g ${npmName}`))
    }
    // 3.提取所有版本号，比对哪些版本号大于当前版本号
    // 4.获取最新的版本号，提示用户更新到该版本
}

function checkEnv() {
    const dotenv = require('dotenv')
    const dotenvPath = path.resolve(userHome, '.env')
    if (pathExists(dotenvPath)) {
        config = dotenv.config({
            path: dotenvPath
        })
    }
    // 第一种方案
    // config = createDefaultConfig()
    // log.verbose('环境变量', config)

    // 第二种方案
    createDefaultConfig()
    // log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    }
    // console.log('process.env.CLI_HOME', process.env.CLI_HOME)
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    // 第一种方案
    // return cliConfig
    // 第二种方案
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}

// function checkInputArgs() {
//     const minimist = require('minimist')
//     args = minimist(process.argv.slice(2))
//     checkArgs()
// }

// function checkArgs() {
//     if(args.debug) {
//         process.env.LOG_LEVEL = 'verbose'
//     } else {
//         process.env.LOG_LEVEL = 'info'
//     }
//     log.level = process.env.LOG_LEVEL
// }

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'))
    }
}

function checkRoot() {
    const rootCheck = require('root-check')
    rootCheck()
}

// function checkNodeVersion() {
//     // 第一步，获取当前Node版本号
//     const currentVersion = process.version
//     // 第二步，比对最低版本号
//     const lowestNodeVersion = constant.LOWEST_NODE_VERSION

//     if (!semver.gte(currentVersion, lowestNodeVersion)) {
//         throw new Error(colors.red(`cui-cli 需要安装 v${lowestNodeVersion}以上版本的 Node.js` ))
//     }
// }

function checkPkgVersion() {
    // console.log(pkg.version)
    // log.success('test', 'success...');
    // log.verbose('debug', 'debug...')
    // log.notice('cli', pkg.version)
}
