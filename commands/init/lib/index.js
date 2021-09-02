'use strict';

// function init(projectName, cmdobj, command) {
function init(argv) {
    // console.log('init', projectName, cmdobj.force, command.parent.targetPath)
    // console.log(process.env.CLI_TARGET_PATH)
    return new InitCommand(argv)
}

const fs = require('fs')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const semver = require('semver')
const Command = require('@imooc-cli-dev-myf/command')
const log = require('@imooc-cli-dev-myf/log')

const TYPE_PROJECT = 'project'
const TYPE_COMPONENT = 'component'

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || ''
        this.force = !!this._cmd.force
        log.verbose('projectName',this.projectName)
        log.verbose('force', this.force)
    }

    async exec() {
        try {
            // 1、准备阶段
            const ret = await this.prepare()
            if (ret) {
                // 2、下载模板
                // 3、安装模板
            }
        } catch (e) {
            log.error(e.message)
        }
    }

    async prepare() {
        const localPath = process.cwd() // 当前进程的目录，即跑命令的目录
        // 1、判断当前目录是否为空
        if(!this.isDirEmpty(localPath)) {
            let ifContinue = false
            if (!this.force) {
                // 1.1 询问是否继续创建
                ifContinue = (await inquirer.prompt({
                    type: 'confirm',
                    name: 'ifContinue',
                    default: false,
                    message: '当前文件夹不为空，是否继续创建项目？'
                })).ifContinue
                if (!ifContinue) {
                    return
                }
            }
            // 2、是否启动强制更新
            if (ifContinue || this.force) {
                // 给用户做二次确认
                const { confirmDelete } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'confirmDelete',
                    default: false,
                    message: '是否确认清空当前目录下的文件？'
                })
                if (confirmDelete) {
                    // 清空当前目录
                    // fse.removeSync() // 这个是删除当前文件夹
                    fse.emptyDirSync(localPath)
                }
            }
        }
        return this.getProjectInfo()
    }

    async getProjectInfo() {
        let projectInfo = {}
        // 3、选择创建项目或组件
        const { type } = await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: '请选择初始化类型',
            default: TYPE_PROJECT,
            choices: [
                {
                    name: '项目',
                    value: TYPE_PROJECT,
                },
                {
                    name: '组件',
                    value: TYPE_COMPONENT
                }
            ]
        })
        log.verbose('type', type)
        // 4、获取项目基本信息
        if (type === TYPE_PROJECT) {
            const o = await inquirer.prompt([
                {
                    type: 'input',
                    message: '请输入项目的名称',
                    name: 'projectName',
                    default: '',
                    validate: function(v) {
                        const done = this.async();

                        setTimeout(function() {
                        // 1.输入的首字符和尾字符必须为英文字符
                        // 2.尾字符必须为英文或数字，不能为字符
                        // 3.字符仅允许”-_“
                          if (!/^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)) {
                            done('请输入合法的项目名称');
                            return;
                          }
                          done(null, true);
                        }, 0);

                        // return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)
                    },
                    filter: function(v) {
                        return v
                    }
                },
                {
                    type: 'input',
                    name: 'projectVersion',
                    message: '请输入项目版本号',
                    default: '1.0.0',
                    validate: function(v) {
                        const done = this.async();

                        setTimeout(function() {
                          if (!semver.valid(v)) {
                            done('请输入合法的版本号');
                            return;
                          }
                          done(null, true);
                        }, 0);
                        // return !!semver.valid(v)
                    },
                    filter: function(v) {
                        if (!!semver.valid(v)) {
                            return semver.valid(v)
                        }
                        return v
                    }
                }
            ])
            console.log(o)
        } else if (type === TYPE_COMPONENT) {

        }
    }

    isDirEmpty(localPath) {
        // console.log(localPath)
        // 或者这样也能拿到
        // console.log(path.resolve('.'))
        // __dirname是当前文件所在的文件夹
        // console.log(__dirname)
        let fileList = fs.readdirSync(localPath)
        // 文件过滤逻辑
        fileList = fileList.filter(file => (
            !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
        ))
        // console.log(fileList)
        return !fileList || fileList.length <= 0
    }
}

module.exports = init;
module.exports.InitCommand = InitCommand
