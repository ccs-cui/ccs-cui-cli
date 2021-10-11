'use strict';

module.exports = exec;

const path = require('path')
const Package = require('@cui-cli/package')
const log = require('@cui-cli/log');
const { exec: spawn } = require('@cui-cli/utils');
const { chdir } = require('process');

const SETTINGS = {
    // init: '@cui-cli/init'
    init: '@cui-cli/init',
    publish: '@cui-cli/publish',
}

// const FILE_SETTINGS = {
//     init: '../../../commands/init/lib/index.js'
// }

const CACHE_DIR = 'dependencies/'

async function exec() {
    let targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    let storeDir = ''
    let pkg
    log.verbose('targetPath', targetPath)
    log.verbose('homePath', homePath)

    // console.log(arguments)
    const cmdobj = arguments[arguments.length - 1]
    // console.log(cmdobj.force)
    // console.log(cmdobj.name())
    const cmdName = cmdobj.name() // 可以做一个映射表把我们的init映射到具体的package
    const packageName = SETTINGS[cmdName]
    // const file = FILE_SETTINGS[cmdName]
    const packageVersion = 'latest'
    // const packageVersion = '1.1.0'

    if (!targetPath) {
        // 生成缓存路径
        targetPath = path.resolve(homePath, CACHE_DIR)
        storeDir = path.resolve(targetPath, 'node_modules')
        log.verbose('targetPath', targetPath)
        log.verbose('storeDir', storeDir)
        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVersion
        })
        if(await pkg.exists()) {
            // 更新package
            await pkg.update()
        } else {
            // 安装package
            await pkg.install()
        }
    } else {
        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVersion
        })
        // console.log(pkg.getRootFilePath())
        // 1.targetPath -> modulePath
        // 2.modulePath -> Package(npm模块)
        // 3.Package.getRootFile(获取入口文件)

        // 封装 -> 复用
    }
    const rootFile = pkg.getRootFilePath()

    // const rootFile = path.resolve(__dirname, file)
    // console.log('rootFile', rootFile)
    if (rootFile) {
        try { 
            // apply这里作用是把数组转为参数列表形式
            // require这种方式是在当前进程中调用
            // require(rootFile).call(null, Array.from(arguments))
            // 将require的调用方式改为node子进程方式调用，可获得更多的cpu资源以获得更高的执行性能
            // fork方法不提供回调而是通过子进程通信进行解决
            // 有用户交互希望不断到数据所以用spawnSync
            // -e是执行代码
            // 相当于node -e "console.log(1)"
            const args = Array.from(arguments)
            const cmd = args[args.length - 1]
            const o = Object.create(null) // 创建一个没有原型链的对象，即纯粹对象
            Object.keys(cmd).forEach(key => {
                if (
                    // cmd.hasOwnProperty(key) && 
                    !key.startsWith('_') && 
                    key !== 'parent'
                    ) {
                    o[key] = cmd[key]
                }
            })
            args[args.length - 1] = o
            const code = `require('${rootFile}').call(null, ${JSON.stringify(args)})`
            const child = spawn('node', ['-e', code], {
                cwd: process.cwd(),
                stdio: 'inherit'
            })
            child.on('error', e => {
                log.error(e.message)
                process.exit(1) // 有错误中断执行
            })
            child.on('exit', e => {
                log.verbose('命令执行成功' + e)
                process.exit(e)
            })
            // child.stdout('data', (chunk) => {
                
            // })
            // child.stderr('data', (chunk) => {

            // })
        } catch (e) {
            log.error(e.message)
        }
    }

}

